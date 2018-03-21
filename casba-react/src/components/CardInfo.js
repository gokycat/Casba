import React from 'react';

class CardInfo extends React.Component {

  render() {
    return (
      <div className='row cardInfo text-center'>
      <form className="form-inline">
        <div className="form-group">
          <label htmlFor="#accType" className="sr-only">Acc Type</label>
          <input type="text" className="form-control" id="accType" value={this.props.accountdetails[0].TYPE}/>
        </div>
        <div className="form-group mx-sm-3">
          <label htmlFor="#balance" className="sr-only">Balance</label>
          <input type="text" className="form-control" id="balance" value={this.props.accountdetails[0].BALANCE}/>
        </div>
      </form>
      <div className='row text-center cardWall'>
        <div className='row bankName'>
          <div className='col-md-6 date'>
            {this.props.accountdetails[0].BANK}
          </div>
        </div>
        <div className='row text-center cardPin'>
          1234567890987654
        </div>
        <div className='row date-vendor'>
          <div className='col-md-6 date'>
            02/20
          </div>
          <div className='col-md-6 vendor'>
            MasterCard
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default CardInfo;
