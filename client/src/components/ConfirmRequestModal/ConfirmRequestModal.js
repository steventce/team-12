import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './ConfirmRequestModal.css';
import Loader from '../Loader';

const default_error_string = 'Please check your input and try again.';

class ConfirmRequestModal extends Component {
  static propTypes = {
    selectedResourceName: React.PropTypes.string.isRequired,
    selectedResourceId: React.PropTypes.number.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired
  }

  constructor(props) {
    super(props);

    this.modalEnum = {
      NONE: 0,
      WAIT: 1,
      ERROR: 2,
      OK: 3,
    }

    this.state = {
      showModal: false,
      modalType: this.modalEnum.NONE,
      errorMsg: ''
    }
    this.submit = this.submit.bind(this);
    this.close = this.close.bind(this);
  }

  submit() {
    this.props.handleSubmit();
    this.setState({ modalType: this.modalEnum.WAIT });
  }

  close() {
    this.setState({ showModal: false });
    if (this.state.modalType === this.modalEnum.ERROR)
      window.location.reload();
    else if (this.state.modalType === this.modalEnum.OK)
      this.props.router.push('/reservations');
  }

  open() {
    this.setState({ showModal: true });
  }

  formatDate(date) {
    return moment(date).format('h:mm a MMM D');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status) {
      if (nextProps.status === 201)
        this.setState({ modalType: this.modalEnum.OK });
      else if (nextProps.status === 409)
        this.setState({ modalType: this.modalEnum.ERROR });
    }
    if (nextProps.errorMsg) {
      this.setState({ errorMsg: nextProps.errorMsg })
    }
  }

  render() {
    const {
      selectedResourceName,
      selectedResourceId,
      startDate,
      endDate,
    } = this.props;

    let title = `Confirm Reservation`;
    let text = `Are you sure you want to reserve ${selectedResourceName} from
             ${this.formatDate(startDate)} to ${this.formatDate(endDate)}?`;
    let confirmButton = <Button bsStyle="primary" onClick={this.submit}>OK</Button>;
    let cancelButton = <Button onClick={this.close}>Cancel</Button>;

    let modalContent;
    if (this.state.modalType === this.modalEnum.NONE) {
      modalContent = (
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">
              { text }
            </div>
          </Modal.Body>

          <Modal.Footer>
            {cancelButton}
            {confirmButton}
          </Modal.Footer>
        </Modal>
      )
    } else if (this.state.modalType === this.modalEnum.WAIT) {
      modalContent = (
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Loader />
          </Modal.Body>
        </Modal>
      )
    } else if (this.state.modalType === this.modalEnum.ERROR) {
      modalContent = (
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Error!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">
                {(this.state.errorMsg) ? this.state.errorMsg : default_error_string }
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.close}>Ok</Button>
          </Modal.Footer>
        </Modal>
      )
    } else if (this.state.modalType === this.modalEnum.OK) {
      modalContent = (
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Reservation created!</Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <LinkContainer to="/reservations">
              <Button bsStyle="primary" onClick={this.close}>Ok</Button>
            </LinkContainer>
          </Modal.Footer>
        </Modal>
      )
    }

    return (
      <div>
        <Button
          bsStyle="primary"
          bsSize="large"
          disabled={selectedResourceId === -1}
          onClick={this.open.bind(this)}>
          Submit
        </Button>

        {modalContent}

      </div>
    );
  }
};

export default ConfirmRequestModal;
