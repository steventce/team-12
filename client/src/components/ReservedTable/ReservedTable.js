import React, { Component } from 'react';
import { div, Button, Modal } from 'react-bootstrap';
import { dateFormatter } from '../../utils/formatter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './ReservedTable.css';
import '../../index.css';
import moment from 'moment';
import TrashIcon from 'react-icons/lib/fa/trash';

import { cancelReservation, getReservations} from '../../redux/modules/ReservationReducer';
import { connect } from 'react-redux';

/*global staffDetails_empid:true*/

class ReservedTable extends Component {

  constructor(props){
    super(props);

    this.state = {
      showModal: false,
      cancelIndex: -1,
      employeeId: staffDetails_empid,
    };

    this.props.dispatch(getReservations(this.state.employeeId));
  }

  onClickCancel(cell, row, rowIndex){
    this.modalOpen(rowIndex);
  }

  onClickConfirmCancel(){
    this.props.dispatch(cancelReservation(this.props.reservations[this.state.cancelIndex].reservation_id,
      () => this.props.dispatch(getReservations(this.state.employeeId))
    ));
    this.modalClose();
  }

  cancelButton(cell, row, enumObject, rowIndex) {
    return (
       <Button
          type="button"
          className="cancel-btn"
          onClick={() =>
          this.onClickCancel(cell, row, rowIndex)}
       >
         <TrashIcon size={16} />
       </Button>
    )
  }

  modalClose() {
    this.setState({ showModal: false, cancelIndex: -1});
  }

  modalOpen(cancelIndex) {
    this.setState({ showModal: true, cancelIndex: cancelIndex});
  }

  formatDate(date) {
    return moment(date).format('h:mm a MMM D');
  }

  render() {
    var selectedResource = this.props.reservations[this.state.cancelIndex] ? this.props.reservations[this.state.cancelIndex]["Resource.Desk.desk_number"] : "";
    var selectedReservation = this.props.reservations[this.state.cancelIndex] ? this.props.reservations[this.state.cancelIndex].reservation_id : "";
    var selectedReservationStartTime = this.props.reservations[this.state.cancelIndex] ?
      this.formatDate(this.props.reservations[this.state.cancelIndex].start_date) : "";
    var selectedReservationEndTime = this.props.reservations[this.state.cancelIndex] ?
      this.formatDate(this.props.reservations[this.state.cancelIndex].end_date) : "";

    return (
    	<div className='container tableContainer'>
		  <BootstrapTable data={this.props.reservations} striped={true} hover={true} pagination options={{hideSizePerPage: true}}>
              <TableHeaderColumn dataField='reservation_id' isKey={true} dataAlign='center' dataSort={true}>Reservation ID</TableHeaderColumn>
		      <TableHeaderColumn dataField='Resource.Desk.desk_number' dataAlign='center' dataSort={true}>Resource ID</TableHeaderColumn>
		      <TableHeaderColumn dataField='Resource.resource_type' dataAlign='center' dataSort={true}>Resource Type</TableHeaderColumn>
		      <TableHeaderColumn dataField='start_date' dataAlign='center' dataSort={true} dataFormat={dateFormatter}>Start Time (d/m/y)</TableHeaderColumn>
		      <TableHeaderColumn dataField='end_date' dataAlign='center' dataSort={true} dataFormat={dateFormatter}>End Time (d/m/y)</TableHeaderColumn>
		      <TableHeaderColumn dataField='cancel' dataAlign='center' dataFormat={this.cancelButton.bind(this)}>Cancel</TableHeaderColumn>
		  </BootstrapTable>
      <Modal show={this.state.showModal} onHide={this.modalClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel the reservation for resource {selectedResource} from {selectedReservationStartTime} to {selectedReservationEndTime}?
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.onClickConfirmCancel.bind(this)}>Confirm</Button>
            <Button onClick={this.modalClose.bind(this)}>Cancel</Button>
          </Modal.Footer>
      </Modal>
		</div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps)(ReservedTable);
