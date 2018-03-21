require('../styles/App.css');
require('../styles/Login.css');
require('../styles/Body.css');
require('../styles/Navbar.css');
require('../styles/About.css');
require('../styles/Features.css');
require('../styles/Stack.css');
require('../styles/Footer.css');

import React from 'react';
import ChatApp from './ChatApp';
import Body from './Body';
import About from './About';
import Features from './Features';
import Stack from './Stack';
import Footer from './Footer';
import io from 'socket.io-client';
import config from '../config';
import { pushRotate as Menu } from 'react-burger-menu';

class App extends React.Component {
  socket = {}
  constructor(props) {
    super(props);
    this.state = { username: '',
                   password: '',
                   firstName: '',
                   lastName: '',
                   email: '',
                   bvn: '',
                   phone: '',
                   NavList: '',
                   flash: '',
                   flashVisibility: '',
                   showLoginModal: false,
                   showRegisterModal: false,
                   showResetModal: false,
                   showPolicy: false,
                   showTerms: false,
                   showPreloader: 'hidden',
                   menuOpen: false,
                   messagesA: []
                 };
    // Bind 'this' to event handlers. React ES6 does not do this by default
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
    this.setBVN = this.setBVN.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPhone = this.setPhone.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.registerSubmitHandler = this.registerSubmitHandler.bind(this);
    this.resetSubmitHandler = this.resetSubmitHandler.bind(this);
    this.toggleNavList = this.toggleNavList.bind(this);
    this.hideNavList = this.hideNavList.bind(this);
    this.closeFlash = this.closeFlash.bind(this);
    this.close = this.close.bind(this);
    this.openLogin = this.openLogin.bind(this);
    this.openRegister = this.openRegister.bind(this);
    this.openReset = this.openReset.bind(this);
    this.openPolicy = this.openPolicy.bind(this);
    this.openTerms = this.openTerms.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

    // Connect to the server
    this.socket = io(config.api).connect();

    // Emit the message to the server to verify url
    this.socket.emit('client:verify', {url: window.location.href});

    this.socket.on('server:registration', message => {
      if(message.tag == 'false'){
        this.setState({showPreloader: 'hidden'})
        this.setState({ loggedout: true})
        this.setState({ flash: message.message})
        this.setState({ flashVisibility: 'block' })
        setTimeout(() => {
          this.setState({ flashVisibility: 'hidden' });
        }, 10000);
      }
      if(message.tag == 'true'){
        this.setState({ registered: true})
      }
      this.addMessage(message);
    });

    this.socket.on('server:password', message => {
      if(message.tag == 'false'){
        this.setState({showPreloader: 'hidden'})
        this.setState({ loggedout: true})
        this.setState({ flash: message.message})
        this.setState({ flashVisibility: 'block' })
        setTimeout(() => {
          this.setState({ flashVisibility: 'hidden' });
        }, 10000);
      }
      if(message.tag == 'true'){
        this.setState({ changed: true})
      }
      this.addMessage(message);
    });

    this.socket.on('server:authentication', message => {
      if(message.tag == 'false'){
        this.setState({showPreloader: 'hidden'})
        this.setState({ loggedout: true})
        this.setState({ flash: message.message})
        this.setState({ flashVisibility: 'block' })
        setTimeout(() => {
          this.setState({ flashVisibility: 'hidden' });
        }, 10000);
      }
      if(message.tag == 'true'){
        this.setState({ loggedin: true})
      }
      this.addMessage(message);
    });
  }


  getInitialState() {
    return {'NavList': 'hidden', 'flashVisibility': 'hidden', 'showModal': false};
  }

  toggleNavList() {
    var css = this.state.NavList === 'hidden' ? 'show' : 'hidden';
    this.setState({'NavList':css});
  }

  hideNavList() {
    this.setState({'NavList': 'hidden'});
  }

  closeFlash() {
    this.setState({flashVisibility: 'hidden'});
  }

  //registration
  setBVN(event) {
    this.setState({ bvn: event.target.value });
  }

  setFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  setPhone(event) {
    this.setState({ phone: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }


  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange (state) {
    this.setState({menuOpen: state.isOpen})
  }

  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu () {
    this.setState({menuOpen: false})
  }

  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  close() {
    this.setState({ showLoginModal: false,
                    showRegisterModal: false,
                    showResetModal: false,
                    showPolicy: false,
                    showTerms: false
                  });
  }

//this function opens the modal for Login
  openLogin() {
    this.setState({ showLoginModal: true
                  });
  }
//this function opens the modal for Registration
  openRegister() {
    this.setState({  showRegisterModal: true,
                     showLoginModal: false
                  });
  }
//this function opens the modal for Password reset
  openReset() {
    this.setState({  showResetModal: true,
                     showLoginModal: false
                  });
  }

//this function opens the modal for Privacy Policy
    openPolicy() {
      this.setState({ showPolicy: true
                    });
    }
//this function opens the modal for Terms and Conditions
    openTerms() {
      this.setState({ showTerms: true
                    });
    }

//This function handles the user registration process and emits the details to be saved in the DB
  registerSubmitHandler(event) {
      event.preventDefault();
      this.setState({ created: true, firstName: this.state.firstName, lastName: this.state.lastName,
                      bvn: this.state.bvn, email: this.state.email, phone: this.state.phone,
                      password: this.state.password, showPreloader: 'show' });
      // Emit the message to the server
      this.socket.emit('client:register', {firstName: this.state.firstName, lastName: this.state.lastName,
                      bvn: this.state.bvn, email: this.state.email, phone: this.state.phone,
                      password: this.state.password });
  }

  // reset password
  resetSubmitHandler(event) {
      event.preventDefault();
      this.setState({ resetPassword: true, email: this.state.email, showPreloader: 'show' });
      // Emit the message to the server
      this.socket.emit('client:resetPassword', {email: this.state.email });
  }

  // authentication
  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  passwordChangeHandler(event) {
    this.setState({ password: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.setState({ username: this.state.username, password: this.state.password, showPreloader: 'show' });
    // Emit user profile for login authentication
    this.socket.emit('client:authenticate', {username: this.state.username, password: this.state.password});
  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messagesA;
    messages.push(message);
    this.setState({ messages });
  }

  render() {
    if (this.state.loggedin) {
      // Form was submitted, now show the main App
      return (
        <ChatApp username={this.state.username} returnHome={this.returnHome} password={this.state.password} messagesA = {this.state.messagesA}/>
      );
    } else if (this.state.loggedout) {
      // Form was not submitted, flash error message
      return (
        <div id="outer-container">
        <Menu isOpen={this.state.menuOpen} right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
          <a onClick={this.openLogin} className="menu-item">Log in</a>
          <a onClick={this.openRegister} className="menu-item">Get Started</a>
          <a onClick={this.closeMenu} className="menu-item" href="#about">About</a>
          <a onClick={this.closeMenu} className="menu-item" href="#features">Features</a>
          <a onClick={this.closeMenu} className="menu-item" href="#stack">Stack</a>
        </Menu>
        <div className="App" id="page-wrap">
          <Body submit={this.usernameSubmitHandler} changeusername={this.usernameChangeHandler}
                        changepassword={this.passwordChangeHandler} NavList={this.state.NavList}
                        toggle={this.toggleNavList.bind(this)} setBVN={this.setBVN} setFirstName={this.setFirstName}
                        setLastName={this.setLastName} setEmail={this.setEmail} setPhone={this.setPhone}
                        setPassword={this.setPassword} register={this.registerSubmitHandler}
                        reset={this.resetSubmitHandler} flash={this.state.flash} flashVisibility={this.state.flashVisibility}
                        closeFlash={this.closeFlash} loggedout={this.state.loggedout}
                        showLoginModal={this.state.showLoginModal} showResetModal={this.state.showResetModal}
                        showRegisterModal={this.state.showRegisterModal} close={this.close}
                        openLogin={this.openLogin} openRegister={this.openRegister} openReset={this.openReset}
                        showPreloader={this.state.showPreloader}/>
          <About />
          <Features />
          <Stack />
          <Footer openPolicy={this.openPolicy} openTerms={this.openTerms} showPolicy={this.state.showPolicy}
                  showTerms={this.state.showTerms} close={this.close} />
        </div>
        </div>

      );
    }
     else {
      // Initial page load, show landing page
      return (
        <div id="outer-container">
        <Menu isOpen={this.state.menuOpen} right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
          <a onClick={this.openLogin} className="menu-item">Log in</a>
          <a onClick={this.openRegister} className="menu-item">Get Started</a>
          <a onClick={this.closeMenu} className="menu-item" href="#about">About</a>
          <a onClick={this.closeMenu} className="menu-item" href="#features">Features</a>
          <a onClick={this.closeMenu} className="menu-item" href="#stack">Stack</a>
        </Menu>
        <div className="App" id="page-wrap">
          <Body submit={this.usernameSubmitHandler} changeusername={this.usernameChangeHandler}
                        changepassword={this.passwordChangeHandler} NavList={this.state.NavList}
                        toggle={this.toggleNavList.bind(this)} setBVN={this.setBVN} setFirstName={this.setFirstName}
                        setLastName={this.setLastName} setEmail={this.setEmail} setPhone={this.setPhone}
                        setPassword={this.setPassword} register={this.registerSubmitHandler}
                        reset={this.resetSubmitHandler} showLoginModal={this.state.showLoginModal}
                        showResetModal={this.state.showResetModal} showRegisterModal={this.state.showRegisterModal}
                        close={this.close} openLogin={this.openLogin} openRegister={this.openRegister}
                        openReset={this.openReset} password = {this.state.password} showPreloader={this.state.showPreloader}/>
          <About />
          <Features />
          <Stack />
          <Footer openPolicy={this.openPolicy} openTerms={this.openTerms} showPolicy={this.state.showPolicy}
                  showTerms={this.state.showTerms} close={this.close} />
        </div>
        </div>
      );
    }
  }

}
App.defaultProps = {
};

export default App;
