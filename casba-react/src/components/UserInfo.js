import React from 'react';

class UserInfo extends React.Component {

  render() {
    return (
      <div className='row userInfo cardWall'>
        <div className='row'>
          <p className='section-title'>Customer Information</p>
        </div>
        <div className='row'>
          <div className='col-md-6 col-xs-6 col-sm-6 userDetails' >
            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-user"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  value={this.props.user[0].FIRST_NAME + this.props.user[0].LAST_NAME}
                  readOnly />
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
                  value={this.props.user[0].PHONE}
                  readOnly />
              </div>
            </div>

            <div className="form-group ">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-bold"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  value={this.props.user[0].BVN}
                  readOnly />
              </div>
            </div>
          </div>

          <div className='col-md-6 col-xs-6 col-sm-6 userDetails' >

            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-envelope"></span>
                </div>
                <input
                  type="email"
                  className='form-control'
                  value={this.props.user[0].EMAIL}
                  readOnly />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-calendar"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  value={this.props.user[0].DATE_OF_BIRTH}
                  readOnly />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-stats"></span>
                </div>
                <input
                  type="text"
                  className='form-control'
                  value={this.props.account}
                  readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserInfo;
