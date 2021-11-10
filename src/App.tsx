import React from 'react';
import './App.css';

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
          <input
            type="text"
            name="messageBody"
            placeholder="Type your message here"
            onChange={handleChange}
            value={''}
          />
        </form>
      </div>
    </div>
  );
};

export default App;
