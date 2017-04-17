import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './ConfirmRequestModal.css';
import Loader from '../Loader';

const default_error_string = 'Please check your input and try again.';
const RESERVATION_LOCK_MS = 6000

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
      errorMsg: '',
      submitDeadline: null, timeLeft_s: 0, timerId: -1
    }
    this.submit = this.submit.bind(this);
    this.close = this.close.bind(this);
    this.confirm = this.confirm.bind(this);
    this.abort = this.abort.bind(this);
  }

  submit() {
    this.props.handleSubmit();
    this.setState({ modalType: this.modalEnum.WAIT });

    clearTimeout(this.state.timerId);
    this.setState({ showModal: true, timeLeft_s: RESERVATION_LOCK_MS / 1000, 
      submitDeadline_s: (Date.now() + RESERVATION_LOCK_MS) / 1000, timerId: setTimeout(() => this.updateTimerLeft(), 1000)});
  }

  updateTimerLeft() {
    if (!this || this.state.timeLeft_s <= 0)
      return

    this.setState({timeLeft_s: this.state.submitDeadline_s - Date.now() / 1000, timerId: setTimeout(() => this.updateTimerLeft(), 1000)})
  }

  getTimeRemaining() {
    const timeLeft_s = Math.max(0, Math.floor(this.state.timeLeft_s))
    const min = Math.floor(timeLeft_s / 60)
    const sec = timeLeft_s % 60
    if (timeLeft_s <= 0)
      return "TIMED OUT!"

    return "Time Remaining: " + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec
  }

  close() {
    this.setState({ showModal: false });
    clearTimeout(this.state.timerId);

    if (this.state.modalType === this.modalEnum.ERROR)
      window.location.reload();
    else if (this.state.modalType === this.modalEnum.OK)
      this.props.router.push('/reservations');
  }

  confirm() {
    this.props.handleConfirm();
    this.setState({ modalType: this.modalEnum.WAIT });
  }

  abort() {
    this.props.handleAbort();
    this.setState({ showModal: false });
    clearTimeout(this.state.timerId);
  }

  formatDate(date) {
    return moment(date).format('h:mm a MMM D');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status) {
      if (nextProps.status === 200)
        this.setState({ modalType: this.modalEnum.NONE })
      else if (nextProps.status === 201)
        this.setState({ modalType: this.modalEnum.OK });
      else if (nextProps.status >= 400)
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
    let confirmButton = <Button bsStyle="primary" disabled={this.state.timeLeft_s <= 0} onClick={this.confirm} id="confirmBtn">OK</Button>;
    let cancelButton = <Button onClick={this.abort} id="cancelConfirmBtn">Cancel</Button>;

    let modalContent;
    if (this.state.modalType === this.modalEnum.NONE) {
      modalContent = (
        <Modal style={{maxWidth:"100vw"}} show={this.state.showModal} onHide={this.abort.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">
              { text }
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="confirmFooter">
              <div style={this.state.timeLeft_s < 60? {color:"red"} : {}}>{this.getTimeRemaining()}</div>
              <div>
                {cancelButton}
                {confirmButton}
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      )
    } else if (this.state.modalType === this.modalEnum.WAIT) {
      modalContent = (
        <Modal style={{maxWidth:"100vw"}} show={this.state.showModal} onHide={this.close}>
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
        <Modal style={{maxWidth:"100vw"}} show={this.state.showModal} onHide={this.close}>
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
        <Modal style={{maxWidth:"100vw"}} show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Reservation created!</Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <LinkContainer to="/reservations">
              <Button bsStyle="primary" onClick={this.close} id="successBtn">Ok</Button>
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
          style={{ marginTop: '10px' }}
          onClick={this.submit}
          id="submitBtn">
          Submit
        </Button>

        {modalContent}

      </div>
    );
  }
};

export default ConfirmRequestModal;
