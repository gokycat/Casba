import React from 'react';
import Button from './Button';

class RegisterForm extends React.Component {

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
        <form onSubmit={this.props.createUser} className="text-center">
          <div className='row text-center'><img src='../images/Kira.png'/></div>
          <div className='text-center'>
            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-user"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  onChange={this.props.setBVN}
                  placeholder="BVN..... you can dial *565*0# to confirm"
                  title="Check your BVN by dialing *565*0# on your mobile phone"
                  minLength="11"
                  maxLength="11"
                  pattern="\d{11}"
                  required />
              </div>
            </div>
            <hr></hr>
            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-user"></span>
                </div>
                <input
                  type="text"
                  className='form-control form-control-lg'
                  onChange={this.props.setFirstName}
                  placeholder="First Name"
                  required />
              </div>
            </div>

            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-user"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  onChange={this.props.setLastName}
                  placeholder="Last Name"
                  required />
              </div>
            </div>

            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-phone"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  onChange={this.props.setPhone}
                  minLength="11"
                  maxLength="11"
                  pattern="\d{11}"
                  placeholder="Phone"
                  required />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-envelope"></span>
                </div>
                <input
                  type="email"
                  className='form-control'
                  onChange={this.props.setEmail}
                  placeholder="Email"
                  required />
              </div>
            </div>
            <hr></hr>
            <div className="form-group ">
              <div className="input-group">
                <input
                  onChange={this.props.setPassword}
                  className="form-control"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  placeholder="Password"
                  type={this.state.visibility}
                  required />
                <div className="input-group-addon">
                    <a onClick={this.toggleVisibility} className='glyphicon glyphicon-eye-open'></a>
                </div>
              </div>
            </div>


          </div>
          <Button type='submit' btnValue='Create'/>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
