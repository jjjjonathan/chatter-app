import React, { useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listMessages } from './graphql/queries';
import { Message } from './API';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';

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
    <div className="container">
      <div className="messages">
        <div className="messages-scroller">
          {messages.map((message) => (
            <div
              key={message.id}
              className={message.author === 'Dave' ? 'message me' : 'message'}
            >
              {message.body}
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
};

export default App;
