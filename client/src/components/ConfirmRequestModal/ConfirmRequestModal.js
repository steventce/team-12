import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';

class ConfirmRequestModal extends Component {
  static propTypes = {
    selectedResourceName: React.PropTypes.string.isRequired,
    selectedResource: React.PropTypes.string.isRequired,
    startDateTime: React.PropTypes.instanceOf(Date).isRequired,
    endDateTime: React.PropTypes.instanceOf(Date).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  formatDate(date) {
    return moment(date).format('h:mm a MMM D');
  }

  render() {
    const {
      selectedResourceName,
      selectedResource,
      startDateTime,
      endDateTime
    } = this.props;

    return (
      <div>
        <Button
          bsStyle="primary"
          disabled={selectedResource === "-1"}
          onClick={this.open.bind(this)}>
          Submit
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reservation</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">
            {`Are you sure you want to reserve ${selectedResourceName} from
             ${this.formatDate(startDateTime)} to ${this.formatDate(endDateTime)}?`}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.close}>Cancel</Button>
            <Button bsStyle="primary" onClick={() => {this.close() ; this.props.handleSubmit()}}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

export default ConfirmRequestModal;
