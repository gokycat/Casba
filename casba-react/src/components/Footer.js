import React from 'react';
import Button from './Button';
import {Modal}  from 'react-bootstrap';
import Policy from './Policy';
import Terms from './Terms';
import Time from 'react-time';
class Footer extends React.Component {

  render() {
    return (
      <div className='footer' id='footer'>
        <div className='row text-center'>
          <h3><b>Josla Electric Company Ltd</b></h3>
          <small><i>Fortune Tower Adeyemo Alakija, Victoria Island, Lagos, Nigeria.</i></small>
          <ul className="list-inline">
            <li className="list-inline-item"><p><span><b>Phone:</b></span> +2348 087 488 793</p></li>
            <li className="list-inline-item"><p><span><b>Email:</b></span> corperate@josla.com.ng</p></li>
          </ul>
          <hr/>
          <ul className="list-inline">
            <li className="list-inline-item"><a href='https://twitter.com/JoslaNigeria' className='fa fa-twitter'></a></li>
            <li className="list-inline-item"><a href='https://www.facebook.com/joslaelectric/' className='fa fa-facebook'></a></li>
            <li className="list-inline-item"><a href='https://www.instagram.com/josla.nigeria/' className='fa fa-instagram'></a></li>
            <li className="list-inline-item"><a href='https://www.linkedin.com/company/josla/' className='fa fa-linkedin'></a></li>
            <li className="list-inline-item"><a href='#' className='' onClick={this.props.openPolicy}> Privacy policy</a></li>
            <li className="list-inline-item"><a href='#' className='' onClick={this.props.openTerms}> Terms Of Service</a></li>
          </ul>
          <p><span className='fa fa-copyright' ></span><i> 2018 Josla Electric Company Ltd. All rights reserved</i></p>
          <p>Terms, conditions, features, availability, pricing, fees, service and support options subject to change without notice</p>
        </div>
        <div className='row footerLogos '>
          <div className='col-xs-6 col-sm-6 col-md-6 joslaLogo'>
            <a href='http://www.josla.com.ng'>
              <img src='../images/josla.png' className='joslaImage' />
            </a>
          </div>
          <div className='col-xs-6 col-sm-6 col-md-6 ibmLogo'>
            <img src='../images/ibm.png' className='ibmImage' />
          </div>
        </div>
        <Modal show={this.props.showPolicy} dialogClassName="custom-modal" onHide={this.props.close}>
          <Modal.Header closeButton>
            <Modal.Title><p className='text-center' >Privacy Policy</p></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12'>
              <Policy/>
            </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
          <p className='text-center'></p>
          <Button btnValue='Close' click={this.props.close} />
          </Modal.Footer>
        </Modal>
        <Modal show={this.props.showTerms} dialogClassName="custom-modal" onHide={this.props.close}>
          <Modal.Header closeButton>
            <Modal.Title><p className='text-center' >Terms and Conditions</p></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12'>
              <Terms/>
            </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
          <p className='text-center'></p>
          <Button btnValue='Close' click={this.props.close} />
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Footer;
