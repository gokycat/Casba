import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Button from './Button';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';


class MyCarousel extends React.Component {
    render() {
      let total = this.props.account;
      let account = null;
      if (total > 0) {
        account =
        <Carousel style={styles} autoPlay={true} infiniteLoop={true} showThumbs={false} >
          {this.props.accounts.map((account, i) => (<div key={i} className={'row cardInfo text-center ' + account.BANK_NAME}>
          <div className='row'>
            <div className='col-xs-4 col-sm-4 col-md-4'>
              <div className='row newWall'>
                <div className='col-md-12'>
                  <p>Bank</p>
                  <p><b>{account.BANK_NAME}</b></p>
                </div>
              </div>
              <div className='row newWall'>
                <div className='col-md-12'>
                  <p>{account.TYPE_NAME}</p>
                  <p><b>{account.ACCOUNT_NO}</b></p>
                </div>
              </div>
            </div>
            <div className='col-xs-8 col-sm-8 col-md-8 balance'>
              <div className='row newWallBalance'>
                <p>Total Spent</p>
                <p className='spend'><b> ₦{account.SPEND}</b></p>
              </div>
            </div>
          </div>
          <div className='row text-center cardFrame'>

            <div className='row text-center cardPin'>
              ***********{account.CARD_NO}
            </div>
            <div className='row date-vendor'>
              <div className='col-md-6 date'>
                {account.EXPIRY_MONTH}/{account.EXPIRY_YEAR}
              </div>
              <div className='col-md-6 vendor'>
                {account.ISSUER_NAME}
              </div>
            </div>
          </div>
          </div>))}
        </Carousel>;
      } if (total == 0) {
        account =
        <Carousel style={styles} autoPlay={true} showStatus={false} infiniteLoop={false} showThumbs={false} >
          <div className='row cardInfo text-center'>

            <div className='row text-center cardFrame'>
              <div className='row bankName'>
                <div className='col-md-6 date'>

                </div>
              </div>
              <div className='row text-center cardPin'>
                You have no account registered yet! Kindly create an account by clicking on the add account button.
              </div>
              <div className='row date-vendor'>
                <div className='col-md-6 date'>

                </div>
                <div className='col-md-6 vendor'>

                </div>
              </div>
            </div>
          </div>
        </Carousel>;
      }
        return (
            <div className='carousel cardWall'>
              <p className='section-title'>Account/Card Information</p>
              {account}
            </div>
        );
    }
}

export default MyCarousel;
