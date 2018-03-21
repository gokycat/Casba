require('../styles/ChatApp.css');

import React from 'react';
import io from 'socket.io-client';
import config from '../config';

import Messages from './Messages';
import ChatInput from './ChatInput';
import Header from './Header';
import App from './App';
import Overlay4Details from './Overlay4Details';

class ChatApp extends React.Component {
  socket = {};
  constructor(props) {
    super(props);
    this.state = { messages: [], tag:'true', user:[], accounts:[], transactions:[], toggleOverlay: 'hidden', inputType: 'text', showReciept: false, receipt:[], showAnalytics: false, timeString: [], amount: [], classification: {}};
    this.sendHandler = this.sendHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.userInfoClickHandler = this.userInfoClickHandler.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);

    // Connect to the server
    this.socket = io(config.api).connect();

    // Emit the message to the server
    this.socket.emit('client:chat', {username: this.props.username, message: 'Hello'});

    this.socket.on(('server:chatbot'+'/'+this.props.username), message => {
      if (message.tag == 'userInfo') {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ showReciept: false});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.toggleMenu();
      } else if (message.tag == 'accountInfo') {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ showReciept: false});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.toggleMenu();
      } else if (message.tag == 'addAccount') {
        this.setState({ inputType: 'number'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      } else if (message.tag == 'accountBank') {
        this.setState({ inputType: 'text'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      } else if (message.tag == 'cardNumber') {
        this.setState({ inputType: 'number'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      } else if (message.tag == 'addCardConfirm') {
        this.setState({ inputType: 'text'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      } else if (message.tag == 'recipientAccount') {
        this.setState({ inputType: 'number'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      } else if (message.tag == 'transferConfirmed') {
        this.setState({ inputType: 'text'});
        this.setState({ showReciept: true})
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.setState({ receipt: message.receipt});
        this.toggleMenu();
      } else if (message.tag == 'paymentConfirmed') {
        this.setState({ inputType: 'text'});
        this.setState({ showReciept: true})
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.setState({ receipt: message.receipt});
        this.toggleMenu();
      } else if (message.tag == 'topupConfirmed') {
        this.setState({ inputType: 'text'});
        this.setState({ showReciept: true})
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.setState({ receipt: message.receipt});
        this.toggleMenu();
      } else if (message.tag == 'transferNotResolved') {
        this.setState({ inputType: 'text'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      } else if (message.tag == 'addAccountConfirmed') {
        this.setState({ inputType: 'text'});
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.toggleMenu();
      } else if (message.tag == 'addCardConfirmed') {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.toggleMenu();
      } else if (message.tag == 'deleteAccountConfirmed') {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.toggleMenu();
      } else if (message.tag == 'deleteCardConfirmed') {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.toggleMenu();
      } else if (message.tag == 'viewBudget') {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
        this.setState({ timeString: message.timeString});
        this.setState({ amount: message.amount});
        this.setState({ classification: message.classification});
        this.setState({ showAnalytics: true});
        this.toggleMenu();
      } else {
        this.setState({ tag: message.tag});
        this.setState({ user: message.user});
        this.setState({ accounts: message.accounts});
        this.setState({ transactions: message.transactions});
      }
      this.addMessage(message);
    });
  }

  getInitialState() {
    return {'toggleOverlay': 'hidden', 'inputType': 'text'};
  }

  toggleMenu() {
    var css = (this.state.toggleOverlay === 'show');
    this.setState({'toggleOverlay':css});
  }

  hideMenu() {
    this.setState({'toggleOverlay': 'hidden'});
  }

  sendHandler(message) {
    const messageObject = {
      username: this.props.username,
      message
    };

    // Emit the message to the server
    this.socket.emit('client:chat', messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }


  // button click handler

  clickHandler(message) {
    this.hideMenu();
    const messageObject = {
      username: this.props.username,
      message
    };


    // Emit the message to the server
    this.socket.emit('client:chat', messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }

  userInfoClickHandler(message) {

    const messageObject = {
      username: this.props.username,
      message
    };


    // Emit the message to the server
    this.socket.emit('client:chat', messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }

  render() {
    if(this.state.user.length > 0){
      return (
        <div className='container'>
          <Header name={[this.state.user[0].FIRST_NAME, this.state.user[0].LAST_NAME].join(' ')} bvn={this.state.user[0].BVN} account= {this.state.accounts.length}/>
          <Messages messages={this.state.messages} toggleMenu={this.toggleMenu.bind(this)} clickHandler={this.clickHandler.bind(this)} userInfoClickHandler={this.userInfoClickHandler.bind(this)} username={this.props.username} user={this.state.user}/>
          <Overlay4Details toggle={this.state.toggleOverlay} hideMenu={this.hideMenu.bind(this)} showReciept={this.state.showReciept} showAnalytics={this.state.showAnalytics} user={this.state.user} account= {this.state.accounts.length} accounts={this.state.accounts} transactions={this.state.transactions}
                           timeString={this.state.timeString} amount={this.state.amount} classification={this.state.classification} receipt={this.state.receipt}/>
          <ChatInput onSend={this.sendHandler} inputType={this.state.inputType} hideMenu={this.hideMenu.bind(this)} />
        </div>
      );
    } else {
      return (
        <div className='container'>
          <Header name='Loading' />
          <Messages messages={this.state.messages} clickHandler={this.clickHandler.bind(this)} username={this.props.username}/>
          <ChatInput onSend={this.sendHandler} inputType={this.state.inputType} hideMenu={this.hideMenu.bind(this)}/>
        </div>
      );
    }
  }

}
ChatApp.defaultProps = {
  id: 'Anonymous'
};

export default ChatApp;
