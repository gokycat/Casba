import React from 'react';
import Profile from './Profile';

class Header extends React.Component {


  render() {
    return (
      <div className='header'>
        <a href='http://localhost:8080'><img alt='Log out' src='../images/Logo.png'  /></a>
        <Profile name={this.props.name}  bvn={this.props.bvn} account={this.props.account}/>
      </div>
    );
  }
}

export default Header;
