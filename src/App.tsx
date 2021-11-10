import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';

const App = () => {
  // Placeholder function for handling changes to our chat bar
  const handleChange = () => {};

  // Placeholder function for handling the form submission
  const handleSubmit = () => {};

  return (
    <div className="container">
      <div className="messages">
        <div className="messages-scroller">
          {/* messages will be loaded here */}
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
