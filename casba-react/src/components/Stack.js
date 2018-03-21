import React from 'react';


class Stack extends React.Component {

  render() {
    return (
      <div className='row stack text-center' id='stack'>
        <div className='row text-center'>
          <h3>Technology Stack</h3>
          <small>CASBA was designed and developed with the following technologies</small>
        </div>
        <div className='row first-row'>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/ibm-cloud.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/DashDB.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/paystack.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/etranzact.png' className='' />
          </div>
        </div>
        <div className='row second-row'>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/ibm-watson.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/googlemaps.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/reactjs.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/nodejs.png' className='' />
          </div>
        </div>
        <hr/>
        <div className='row second-row' >
          <div className='col-md-6 col-sm-6 col-xs-6 text-center'>
            <h4>Coming Soon on</h4>
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/appstore.png' className='' />
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3'>
            <img src='../images/googleplay.png' className='' />
          </div>
        </div>
      </div>
    );
  }
}

export default Stack;
