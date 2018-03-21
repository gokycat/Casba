import React from 'react';

import UserInfo from './UserInfo';
import Preference from './Preference';
import MyCarousel from './Carousel';
import Reciept from './Reciept';
import Analytics from './Analytics';

class GeneralDetails extends React.Component {

  render() {
    if(this.props.showReciept) {
      return (
        <div className='generalDetails' >
          <UserInfo user={this.props.user} account={this.props.account}/>
          <Reciept receipt={this.props.receipt}/>
          <MyCarousel account={this.props.account} accounts={this.props.accounts}/>
        </div>
      );
    }
    else if(this.props.showAnalytics) {
      return (
        <div className='generalDetails' >
          <Analytics timeString={this.props.timeString} amount={this.props.amount} classification={this.props.classification} />
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
