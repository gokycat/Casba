import React from 'react';

import Time from 'react-time';

const reactStringReplace = require('react-string-replace')

// This component displays an individual message.
// We should have logic to display it on the right if the user sent the
// message, or on the left if it was received from someone else.
class Message extends React.Component {

  //view
  render() {
    let now = new Date()
    // Was the message sent by the current user. If so, add a css class
    const fromMe = this.props.fromMe ? 'from-me' : '';
    return (
      <div className={`message ${fromMe}`}>
        <div className='username'>
          <img src='../images/Kira.png'  />
        </div>
        <div className='message-body animated zoomIn delay-05s'>
        { reactStringReplace(this.props.message, '£userName', (match, i) => (
             <span key={i} style={{ color: 'red', marginLeft:'2px' }}> { this.props.user[0].FIRST_NAME } </span>
          )) }
        </div>
        <div className='message-time'>
          <Time value={now} format="HH:mm A" />
        </div>
      </div>
    );
  }
}

Message.defaultProps = {
};

export default Message;
