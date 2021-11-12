import React, { useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listMessages } from './graphql/queries';
import { Message } from './API';

import './App.css';
import { Container, Stack, TextField, InputAdornment } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

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

  return (
    <Container maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="flex-end"
        alignItems="flex-start"
        spacing={2}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.author === 'Dave' ? 'message me' : 'message'}
          >
            {message.body}
          </div>
        ))}
      </Stack>
      <div className="chat-bar">
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
      </div>
    </Container>
  );
};

export default App;
