import React from 'react';

import GeneralDetails from './GeneralDetails';

import Button from './Button';

class Overlay4Details extends React.Component {

  render() {
    return (
      <div className={'Overlay animated fadeInRightBig col-md-3 text-center ' + this.props.toggle }>
      <GeneralDetails user={this.props.user} showReciept={this.props.showReciept} transactions={this.props.transactions} account={this.props.account} accounts={this.props.accounts}/>
      <Button btnValue='Close' glyphicon='glyphicon glyphicon-remove' click={this.props.hideMenu} />
      </div>
    );

  }

}

export default Overlay4Details;
