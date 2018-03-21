import React from 'react';
import Button from './Button';

class ResetForm extends React.Component {

  render() {
    return (
      <div className='text-center Login'>
        <form onSubmit={this.props.reset} className="text-center">
          <img src='../images/Kira.png'  />
          <div className='text-center'>
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
          </div>
          <div>
          </div>
          <Button type='submit' btnValue='Reset Password'/>
        </form>
      </div>
    );
  }
}

export default ResetForm;
