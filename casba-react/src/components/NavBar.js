import React from 'react';

import Button from './Button';

import { stack as Menu } from 'react-burger-menu';

class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <header className='row navBar' id='navBar'>
        <div className='col-xs-4 col-sm-4 col-md-4'>
          <a href='#navBar'><span><img src='../images/Logo.png' /></span>    CASBA</a>
        </div>

        <div className='col-xs-8 col-sm-8 col-md-8'>
          <ul className={'nav-list-desktop list-inline ' + this.props.NavList }>
            <li className='nav-item list-inline-item'><a href='#about'>About</a></li>
            <li className='nav-item list-inline-item'><a href='#features'>Features</a></li>
            <li className='nav-item list-inline-item'><a href='#stack'>Technology</a></li>
            <li className='nav-item list-inline-item'><a href='#' onClick={this.props.openLogin}><span className="glyphicon glyphicon-log-in"></span> Sign in</a></li>
          </ul>
        </div>
      </header>
    );
  }
}

export default NavBar;
