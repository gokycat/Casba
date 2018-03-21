import React from 'react';
import moment from 'moment';


class Preference extends React.Component {

  render() {
    let total = this.props.transactions.length;
    let transaction = null;
    if (total > 0) {
      transaction =
      <div>
        {this.props.transactions.map((transaction) => (
        <div className='row'>
          <p> On {moment(Number(transaction.TOC)).format("MM-DD-YYYY")} you {transaction.CATEGORY} the sum of ₦{transaction.AMOUNT} from {transaction.ACCOUNT_NO} </p>
        </div>
        ))}
      </div>
    }
    if (total == 0) {
      transaction =
      <div className='row'>
        Hello!, You are yet to make any transaction, Make seamless transactions just by conversing with Kira.
      </div>
    }
    return (
      <div className='row cardWall preference' >
        <div className='row'>
          <p className='section-title'>Transaction Information</p>
        </div>
        <div className='row'>
          {transaction}
        </div>
      </div>
    );
  }
}

export default Preference;
