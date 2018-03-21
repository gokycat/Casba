import React from 'react';


class About extends React.Component {

  render() {
    return (
      <div className='row about' id='about'>
        <div className='col-md-4 text-center' >
          <img src='../images/chat.png' />
          <h4>CHAT</h4>
          <p>Direct conversation with Kira our A.I <br/> designed to aid all transactions</p>
        </div>
        <div className='col-md-4 text-center' >
          <img src='../images/naira.png' />
          <h4>SPEND</h4>
          <p>Make fast financial transactions on our <br/> digital platform</p>
        </div>
        <div className='col-md-4 text-center' >
          <img src='../images/analyse.png' />
          <h4>ANALYSE</h4>
          <p>Get real-time insight to enable you <br/> budget, save and invest</p>
        </div>
      </div>
    );
  }
}

export default About;
