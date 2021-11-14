import React, { useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Auth } from '@aws-amplify/auth';
import { Message } from './API';
import '@aws-amplify/pubsub';
import { messagesByChannelID } from './graphql/queries';
import { onCreateMessage } from './graphql/subscriptions';
import { createMessage } from './graphql/mutations';
import { withAuthenticator } from '@aws-amplify/ui-react';

import { SxProps } from '@mui/system';
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
  const [messageBody, setMessageBody] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    Auth.currentUserInfo().then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);

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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setMessageBody(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const input = {
      channelID: '1',
      author: userInfo.id,
      body: messageBody.trim(),
    };

    try {
      setMessageBody('');
      await API.graphql(graphqlOperation(createMessage, { input }));
    } catch (error) {
      console.warn(error);
    }
  };

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
          <Box
            key={message.id}
            sx={chatStyles(message.author === userInfo?.id)}
          >
            {message.body}
          </Box>
        ))}
      </Stack>
      <form onSubmit={handleSubmit}>
        <TextField
          disabled={userInfo === null}
          variant="outlined"
          name="messageBody"
          placeholder="Type your message here"
          onChange={handleChange}
          value={messageBody}
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

export default withAuthenticator(App);
