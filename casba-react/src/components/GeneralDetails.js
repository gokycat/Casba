import React from 'react';

import UserInfo from './UserInfo';
import Preference from './Preference';
import MyCarousel from './Carousel';
import Reciept from './Reciept'

class GeneralDetails extends React.Component {

  render() {
    if(this.props.showReciept) {
      return (
        <div className='generalDetails' >
          <UserInfo user={this.props.user} account={this.props.account}/>
          <MyCarousel account={this.props.account} accounts={this.props.accounts}/>
          <Reciept transactions={this.props.transactions}/>
        </div>
      );
    }
    else {
      return (
        <div className='generalDetails' >
          <UserInfo user={this.props.user} account={this.props.account}/>
          <MyCarousel account={this.props.account} accounts={this.props.accounts}/>
          <Preference transactions={this.props.transactions}/>
        </div>
      );
    }

  }

}

export default GeneralDetails;
