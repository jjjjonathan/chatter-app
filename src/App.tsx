import React, { useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listMessages } from './graphql/queries';
import { Message } from './API';

import {
  Container,
  Stack,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { SxProps } from '@mui/system';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Declare any type as workaround for https://github.com/aws-amplify/amplify-js/issues/4257
    (API.graphql(graphqlOperation(listMessages)) as any).then(
      (response: any) => {
        const items = response.data?.listMessages?.items;

        if (items) {
          setMessages(items);
        }
      },
    );
  }, []);

  // Placeholder function for handling changes to our chat bar
  const handleChange = () => {};

  // Placeholder function for handling the form submission
  const handleSubmit = () => {};

  const chatStyles = (me: boolean) => {
    const base: SxProps = {
      mt: 4,
      px: 8,
      py: 12,
      maxWidth: 240,
      background: '#f1f0f0',
      borderRadius: '16',
      fontSize: '14',
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
