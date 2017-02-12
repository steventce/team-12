import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';

class ConfirmRequestModal extends Component {
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
    return moment(date).format('MMM D h:mm A');
  }

  render() {
    const { selectedResource, startDateTime, endDateTime } = this.props;
    return (
      <div>
        <Button
          bsStyle="primary"
          disabled={selectedResource === ''}
          onClick={this.open.bind(this)}>
          Submit
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reservation</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">
            {`Are you sure you want to reserve ${selectedResource} from
              ${this.formatDate(startDateTime)} to ${this.formatDate(endDateTime)}?`}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.close}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.props.handleSubmit}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

export default ConfirmRequestModal;
