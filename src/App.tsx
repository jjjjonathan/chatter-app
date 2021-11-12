import React, { useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID } from './graphql/queries';
import { Message } from './API';
import { SxProps } from '@mui/system';
import '@aws-amplify/pubsub';
import { onCreateMessage } from './graphql/subscriptions';

import {
  Container,
  Stack,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // API.graphql is set to any type as workaround for this issue:
  // https://github.com/aws-amplify/amplify-js/issues/4257

  useEffect(() => {
    (
      API.graphql(
        graphqlOperation(messagesByChannelID, {
          channelID: '1',
          sortDirection: 'ASC',
        }),
      ) as any
    ).then((response: any) => {
      const items = response.data?.messagesByChannelID?.items;

      if (items) {
        setMessages(items);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = (
      API.graphql(graphqlOperation(onCreateMessage)) as any
    ).subscribe({
      next: (event: any) => {
        setMessages([...messages, event.value.data.onCreateMessage]);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [messages]);

  // Placeholder function for handling changes to our chat bar
  const handleChange = () => {};

  // Placeholder function for handling the form submission
  const handleSubmit = () => {};

  const chatStyles = (me: boolean) => {
    const base: SxProps = {
      mt: '4px',
      px: '8px',
      py: '12px',
      maxWidth: 240,
      background: '#f1f0f0',
      borderRadius: '16px',
    };

    if (me)
      return {
        ...base,
        alignSelf: 'flex-end',
        background: '#f19e38',
        color: 'white',
      };
    return base;
  };

  return (
    <Container maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="flex-end"
        alignItems="flex-start"
        spacing={2}
      >
        {messages.map((message) => (
          <Box key={message.id} sx={chatStyles(message.author === 'Dave')}>
            {message.body}
          </Box>
        ))}
      </Stack>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          name="messageBody"
          placeholder="Type your message here"
          onChange={handleChange}
          value={''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Container>
  );
};

export default App;
