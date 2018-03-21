import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';


class Features extends React.Component {

  render() {
    return (
      <div className='row features' id='features'>
        <div className='row text-center' id='feature-tag-line' >
          <h3><b>Features that makes us stand out</b></h3>
          <p>CASBA is built with state of the art technologies that have awesome features <br/> to make financial transactions fast, easy and convenient.</p>
        </div>
        <div className='no-carousel'>
          <div className='row first-row' >
            <div className='col-md-4 text-center' >
              <div className='featureWall'>
                <img src='../images/certificate.png' />
                <h4>Financial Certificate</h4>
                <small>All your financial information in one safe place for easy access</small>
              </div>
            </div>
            <div className='col-md-4 text-center' >
              <div className='featureWall'>
                <img src='../images/funds-icon.png' />
                <h4>Funds Transfer</h4>
                <small>Easy, fast & interactive means of transferring money to friends and family</small>
              </div>
            </div>
            <div className='col-md-4 text-center' >
              <div className='featureWall'>
                <img src='../images/bills-icon.png' />
                <h4>Bills Payment</h4>
                <small>Direct payment of all your electric, TV & internet bills</small>
              </div>
            </div>
          </div>
          <div className='row second-row' >
            <div className='col-md-4 text-center' >
              <div className='featureWall'>
                <img src='../images/airtime-icon.png' />
                <h4>Airtime TopUp</h4>
                <small>Quick & instant payment to all your preferred mobile network</small>
              </div>
            </div>
            <div className='col-md-4 text-center' >
              <div className='featureWall'>
                <img src='../images/locate-icon.png' />
                <h4>Locate ATM</h4>
                <small>Locate the nearest cash point for easy access to cash</small>
              </div>
            </div>
            <div className='col-md-4 text-center' >
              <div className='featureWall'>
                <img src='../images/expense-icon.png' />
                <h4>Manage Expenses</h4>
                <small>Real-time insight to better manage your spend behaviour.</small>
              </div>
            </div>
          </div>
        </div>
        <Carousel className='feature-carousel' style={styles} autoPlay={true} infiniteLoop={true} showThumbs={false} >
            <div className='text-center' >
              <div className='featureWall'>
                <img src='../images/certificate.png' />
                <h4>Digital Certificate</h4>
                <small>All your personal & financial details in one place for easy access</small>
              </div>
            </div>
            <div className='text-center' >
              <div className='featureWall'>
                <img src='../images/funds-icon.png' />
                <h4>Funds Transfer</h4>
                <small>Easy, fast & interactive means of transferring money to friends and family</small>
              </div>
            </div>
            <div className='text-center' >
              <div className='featureWall'>
                <img src='../images/bills-icon.png' />
                <h4>Bills Payment</h4>
                <small>Direct payment of all your electric, TV & internet bills</small>
              </div>
            </div>
            <div className='text-center' >
              <div className='featureWall'>
                <img src='../images/airtime-icon.png' />
                <h4>Airtime TopUp</h4>
                <small>Quick & instant payment to all your preferred mobile network</small>
              </div>
            </div>
            <div className='text-center' >
              <div className='featureWall'>
                <img src='../images/locate-icon.png' />
                <h4>Locate ATM</h4>
                <small>Locate the nearest cash point for easy access to cash</small>
              </div>
            </div>
            <div className='text-center' >
              <div className='featureWall'>
                <img src='../images/expense-icon.png' />
                <h4>Manage Expenses</h4>
                <small>All your personal & financial details in one place for easy access</small>
              </div>
            </div>
        </Carousel>
      </div>
    );
  }
}

export default Features;
