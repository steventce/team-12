import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';

class ConfirmRequestModal extends Component {
  static propTypes = {
    selectedResourceName: React.PropTypes.string.isRequired,
    selectedResourceId: React.PropTypes.number.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired
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
  
  dateDuration(start_date, end_date){
    var start_date_ = moment(start_date);
    var end_date_ = moment(end_date);
    
    var time_diff = moment.duration(end_date_.diff(start_date_));
    return time_diff.asHours();
  }

  render() {
    const {
      selectedResourceName,
      selectedResourceId,
      startDate,
      endDate
    } = this.props;
    
    let title = null;
    let text = null;
    let confirmButton = null;
    let cancelButton = null;
    if (this.dateDuration(startDate, endDate) <= 120){
        title = `Confirm Reservation`;
        text = `Are you sure you want to reserve ${selectedResourceName} from
             ${this.formatDate(startDate)} to ${this.formatDate(endDate)}?`;
        cancelButton = <Button onClick={this.close}>Cancel</Button>;
        confirmButton = <Button bsStyle="primary" onClick={() => {this.close() ; this.props.handleSubmit()}}>OK</Button>;
    }else{
        title = `Request Error`;
        text = `Reservation range cannot be more than 120 hours (5 days). Your current selected dates are from
                ${this.formatDate(startDate)} to ${this.formatDate(endDate)}, which is ${this.dateDuration(startDate,endDate)} hours.`;
        cancelButton = <Button onClick={this.close}>Ok</Button>;
    }    
    
    return (
      <div>
        <Button
          bsStyle="primary"
          disabled={selectedResourceId === -1}
          onClick={this.open.bind(this)}>
          Submit
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton> 
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">
            {text}
            </div>
          </Modal.Body>

          <Modal.Footer>
            {cancelButton}
            {confirmButton}
          </Modal.Footer>
        </Modal>
        
      </div>
    );
  }
};

export default ConfirmRequestModal;
