import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'

class AlertMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisible: this.props.alertVisible
    }
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.alertVisible) {
      this.setState({ alertVisible: nextProps.alertVisible });
    }
  }

  renderError() {
    return (
      <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <h4 style={{ textAlign: 'center' }}>Oh snap! You got an error!</h4>
      </Alert>
    );
  }

  renderSuccess() {
    return (
      <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
        <h4 style={{ textAlign: 'center' }}>Reservation created!</h4>
      </Alert>
    );
  }

  render() {
    console.log(this.state.alertVisible);
    if (this.state.alertVisible) {
      return (
        <div style={{ position: 'absolute', top: "50px", left: '20px', right: "20px" }} >
          {/* TODO: maybe change to enum so it can be more resuable */}
          { (this.state.alertVisible == '409') ? this.renderError() : this.renderSuccess() }
        </div>
      );
    } else {
      return null;
    }
  }

  handleAlertDismiss() { this.setState({ alertVisible: false }); }

  handleAlertShow() { this.setState({ alertVisible: true }); }
}

export default AlertMessage;