import React from 'react';
import Button from './Button';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
                   visibility: 'password'
                 };
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  getInitialState() {
    return {'visibility': 'password'};
  }

  toggleVisibility() {
    var css = this.state.visibility === 'password' ? 'text' : 'password';
    this.setState({'visibility':css});
  }

  render() {
    return (
      <div className='text-center Login'>
        <form onSubmit={this.props.submit} className="text-center">
          <div className='row text-center'><img src='../images/Kira.png'  /></div>
          <div className='text-center'>
            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-phone"></span>
                </div>
                <input
                  type="number"
                  className='form-control'
                  onChange={this.props.changeusername}
                  minLength="11"
                  maxLength="11"
                  pattern="\d{11}"
                  placeholder="Enter your Phone (Mobile) Number"
                  required />
              </div>
            </div>

            <div className="form-group ">
              <div className="input-group">
              <input
                type={this.state.visibility}
                className='form-control'
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                onChange={this.props.changepassword}
                placeholder="Enter a Password..."
                required />
                <div className="input-group-addon">
                    <a onClick={this.toggleVisibility} className='glyphicon glyphicon-eye-open'></a>
                </div>
              </div>
            </div>

          </div>

          <div>
          <a href='#' onClick={this.props.openReset}>Having trouble logging in?</a>
          </div>

          <Button type='submit' btnValue='Submit'/>
        </form>
      </div>
    );
  }
}

export default LoginForm;
