import React from 'react';
import Button from 'react-bootstrap/lib/Button';

class MyButton extends React.Component {

  render() {
    return (
      <Button type={this.props.type} bsStyle="default" className='btn btn-default message-btn' bsSize="small" onClick={this.props.click}>
      <span className={this.props.glyphicon}></span> {this.props.btnValue}
      </Button>
    );
  }
}

export default MyButton;
