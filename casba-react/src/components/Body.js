import React from 'react';

import NavBar from './NavBar';

import Button from './Button';

import {Modal}  from 'react-bootstrap';

import LoginForm from './LoginForm';

import RegisterForm from './RegisterForm';

import ResetForm from './ResetForm';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                   closeflash: 'block'
                 };

  }


  render() {
    if (this.props.loggedout) {
      return (
        <div className='row body' >
          <NavBar openLogin={this.props.openLogin} openRegister={this.props.openRegister} NavList={this.props.NavList} toggleNavList={this.props.toggleNavList} />
          <div className='row adlib'>
            <div className='col-xs-12 col-sm-12 col-md-6 financial_conversations'>
              <h1>Financial transactions as Conversations!</h1>
              <p>It is powered by an AI system, Kira, that simulates intelligent conversations with users to carryout
              financial transactions such as transfer funds, topup airtime, pay bills and analytics to
              monitor spend in real-time.</p>
              <Button className='btn btn-xs' id='btn-signup' btnValue='Get Started' click={this.props.openRegister} />
            </div>
          </div>
          <Modal show={this.props.showLoginModal} dialogClassName="custom-modal" onHide={this.props.close}>
            <Modal.Header closeButton>
              <Modal.Title><p className='text-center' >Login to Casba</p></Modal.Title>
              <div className={"row alert alert-warning alert-dismissable text-center " + this.props.flashVisibility}>
                <a href="#" onClick={this.props.closeFlash} className="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>{this.props.flash}</strong>.
              </div>
            </Modal.Header>
            <Modal.Body>
            <div className='row'>
              <div className='col-xs-12 col-sm-12 col-md-12'>
                <LoginForm submit={this.props.submit} openReset={this.props.openReset}  changeusername={this.props.changeusername} changepassword={this.props.changepassword} />
                <div className={'row pre-loader ' + this.props.showPreloader}></div>
              </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <p className='text-center'> Do not have an account? <a href='#' onClick={this.props.openRegister}> Sign up >></a> </p>
            <Button btnValue='Close' click={this.props.close} />
            </Modal.Footer>
          </Modal>

          <Modal show={this.props.showRegisterModal} dialogClassName="custom-modal" onHide={this.props.close}>
            <Modal.Header closeButton>
              <Modal.Title><p className='text-center' >Register on Casba</p></Modal.Title>
              <div className={"row alert alert-warning alert-dismissable text-center " + this.props.flashVisibility}>
                <a href="#" onClick={this.props.closeFlash} className="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>{this.props.flash}</strong>.
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-xs-0 col-sm-0 col-md-4'>
                  <div className='row text-center' id='adlibModal'><h1>Built for Nigerians!</h1></div>
                  <div className='row' id='caption' id='adlibModal'><p>CASBA is a platform to access real-time financial services powered by your personalised assistant called Kira.</p></div>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-8'>
                <RegisterForm createUser={this.props.register} setBVN={this.props.setBVN} setFirstName={this.props.setFirstName}
                setLastName={this.props.setLastName} setEmail={this.props.setEmail} setPhone={this.props.setPhone}
                setPassword={this.props.setPassword} />
                <div className={'row pre-loader ' + this.props.showPreloader}></div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <p className="text-left">By clicking "Get Started for CASBA", you agree to our terms of service and privacy policy. We’ll occasionally send you account related emails.</p>
              <Button btnValue='Close' click={this.props.close} />
            </Modal.Footer>
          </Modal>

          <Modal show={this.props.showResetModal} dialogClassName="custom-modal" onHide={this.props.close}>
            <Modal.Header closeButton>
              <Modal.Title><p className='text-center' >Register on Casba</p></Modal.Title>
              <div className={"row alert alert-warning alert-dismissable text-center " + this.props.flashVisibility}>
                <a href="#" onClick={this.props.closeFlash} className="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>{this.props.flash}</strong>.
              </div>
            </Modal.Header>
            <Modal.Body>
              <ResetForm reset={this.props.reset} setEmail={this.props.setEmail} />
              <div className={'row pre-loader ' + this.props.showPreloader}></div>
            </Modal.Body>
            <Modal.Footer>
              <Button btnValue='Close' click={this.props.close} />
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else {
      return (
        <div className='row body' id='body'>
        <NavBar openLogin={this.props.openLogin} openRegister={this.props.openRegister} NavList={this.props.NavList} toggleNavList={this.props.toggleNavList} />
        <div className='row adlib'>
          <div className='col-xs-12 col-sm-12 col-md-6 financial_conversations'>
            <h1>Financial transactions as Conversations!</h1>
            <p>It is powered by an AI system, Kira, that simulates intelligent conversations with users to carryout
            financial transactions such as transfer funds, topup airtime, pay bills and analytics to
            monitor spend in real-time.</p>
            <Button className='btn btn-xs' id='btn-signup' btnValue='Get Started' click={this.props.openRegister} />
          </div>
        </div>
        <Modal show={this.props.showLoginModal} dialogClassName="custom-modal" onHide={this.props.close}>
            <Modal.Header closeButton>
              <Modal.Title><p className='text-center' >Login to Casba</p></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-xs-12 col-sm-12 col-md-12'>
                  <LoginForm submit={this.props.submit} openReset={this.props.openReset}  changeusername={this.props.changeusername} changepassword={this.props.changepassword} />
                  <div className={'row pre-loader ' + this.props.showPreloader}></div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <p className='text-center'> Do not have an account? <a href='#' onClick={this.props.openRegister}> Sign up >></a> </p>
              <Button btnValue='Close' click={this.props.close} />
            </Modal.Footer>
          </Modal>

          <Modal show={this.props.showRegisterModal} dialogClassName="custom-modal" onHide={this.props.close}>
            <Modal.Header closeButton>
              <Modal.Title><p className='text-center' >Register on Casba</p></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-xs-0 col-sm-0 col-md-4'>
                  <div className='row' id='adlibModal'><h1>Built for Nigerians!</h1></div>
                  <div className='row' id='caption' id='adlibModal'><p>CASBA is a platform to access real-time financial services powered by your personalised assistant called Kira.</p></div>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-8'>
                <RegisterForm createUser={this.props.register} setBVN={this.props.setBVN} setFirstName={this.props.setFirstName}
                setLastName={this.props.setLastName} setEmail={this.props.setEmail} setPhone={this.props.setPhone}
                setPassword={this.props.setPassword} />
                <div className={'row pre-loader ' + this.props.showPreloader}></div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <p className="text-left">By clicking "Get Started for CASBA", you agree to our terms of service and privacy policy. We’ll occasionally send you account related emails.</p>
              <Button btnValue='Close' click={this.props.close} />
            </Modal.Footer>
          </Modal>

          <Modal show={this.props.showResetModal} dialogClassName="custom-modal" onHide={this.props.close}>
            <Modal.Header closeButton>
              <Modal.Title><p className='text-center' >Register on Casba</p></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ResetForm reset={this.props.reset} setEmail={this.props.setEmail} />
              <div className={'row pre-loader ' + this.props.showPreloader}></div>
            </Modal.Body>
            <Modal.Footer>
              <Button btnValue='Close' click={this.props.close} />
            </Modal.Footer>
          </Modal>
        </div>
      );
    }

  }
}

export default Body;
