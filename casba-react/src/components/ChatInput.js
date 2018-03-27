import React from 'react';

class ChatInput extends React.Component {

  // state
  constructor(props) {
    super(props);
    this.state = { chatInput: '' };

    // React ES6 does not bind 'this' to event handlers by default
    this.submitHandler = this.submitHandler.bind(this);
    this.textChangeHandler = this.textChangeHandler.bind(this);
  }

  // event handlers
  submitHandler(event) {
    // Stop the form from refreshing the page on submit
    event.preventDefault();

    // Clear the input box
    this.setState({ chatInput: '' });

    // Call the onSend callback with the chatInput message
    this.props.onSend(this.state.chatInput);
  }

  textChangeHandler(event)  {
    this.setState({ chatInput: event.target.value });
    this.props.hideMenu();
  }

  //view
  render() {
    return (
      <form className="chat-input form-group" onSubmit={this.submitHandler}>
        <input type="text"
          onChange={this.textChangeHandler}
          className='form-control form-control-lg input-lg'
          value={this.state.chatInput}
          placeholder="Write a message..."
          required />
      </form>
    );
  }
}

ChatInput.defaultProps = {
};

export default ChatInput;
