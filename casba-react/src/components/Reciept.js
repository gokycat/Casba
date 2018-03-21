import React from 'react';
import Time from 'react-time';

class Reciept extends React.Component {


  render() {
    let now = new Date();
    return (
      <div className='recieptWall'>
        <div className='reciept'>
          <div className='reciept-header row'>
            <div className='reciept-image-div row'>
              <img alt='Kira' src='../images/Kira.png'  />
            </div>
            <div className='reciept-time'>
              <Time value={now} titleFormat="YYYY/MM/DD HH:mm" />
            </div>
          </div>
        </div>
        <div className='reciept-body'>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Recipient:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'>John Doe (1234567890)</div>
          </div>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Recipient Bank:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'>Zenith</div>
          </div>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Deducted Account:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'> 0987654321 (Savings)</div>
          </div>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Deducted Bank:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'>GTB</div>
          </div>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Transaction Amount:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'>₦1,000,000</div>
          </div>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Transaction id:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'>asdfg1234567890</div>
          </div>
          <div className='row reciept-row'>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-questions'>Description:</div>
            <div className='col-xs-6 col-sm-6 col-md-6 reciept-answers'></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reciept;
