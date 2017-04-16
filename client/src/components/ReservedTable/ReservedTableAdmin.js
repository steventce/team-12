import React, { Component } from 'react';
import {
  div,
  Button,
  Modal,
  Row
} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { dateFormatter } from '../../utils/formatter';
import moment from 'moment';
import './ReservedTable.css';
import './ReservedTableAdmin.css';

import { cancelReservation, editReservation, getAdminReservations } from '../../redux/modules/ReservationReducer';
import { connect } from 'react-redux';

// TODO: Get this from database?
const resourceTypes = ['Desk', 'Chair', 'Phone'];
const BuildingArr = ['Broadway Green Building'];

class ReservedTableAdmin extends Component {

  constructor(props){
    super(props);

    this.modalEnum = {
      NONE: -1,
      CANCEL: 0,
      EDIT: 1,
    }

    this.editOptions = {
      resourceType: "Desk",
      newStartTime: "",
      newEndTime: ""
    }

    this.state = {
      modalIndex: -1,
      floorNum: -1,
      modalType: this.modalEnum.NONE,
      editOptions: this.editOptions,
      errorMsg: ""
    };

    this.props.dispatch(getAdminReservations()).then(function(response) {
    });
    
    
  }

  // Edit Modal

  onClickEdit(cell, row, rowIndex){
    this.modalOpenEdit(rowIndex);
  }

  onClickConfirmEdit(){
    let updatedReservation = {};
    let currentReservation = this.props.reservations[this.state.modalIndex];
    let editedOptions = this.state.editOptions;

    console.log(currentReservation);

    // updatedReservation.resourceType = editedOptions.resourceType;
    updatedReservation.reservationId = currentReservation.reservation_id,
    updatedReservation.resourceId = currentReservation.resource_id,
    updatedReservation.staffName = currentReservation.staff_name,
    updatedReservation.staffDepartment = currentReservation.staff_department,
    updatedReservation.staffEmail = currentReservation.staff_email,
    updatedReservation.staffId = currentReservation.staff_id,
    updatedReservation.startDate = moment(editedOptions.newStartTime).format("h:mm a MM/DD/YY");
    updatedReservation.endDate = moment(editedOptions.newEndTime).format("h:mm a MM/DD/YY");
    let that = this;
    this.props.dispatch(editReservation(updatedReservation)).then(function(response) {
      if (typeof response.payload.response == 'undefined') {
        that.props.dispatch(getAdminReservations());
        that.modalCloseEdit();
      } else if (response.payload.response.status !== 200) {
        that.setState({errorMsg: response.payload.response.data});
        return;
      }
      // could do secondary actions here
    });
    // this.setState({reservationList: {...this.props.reservations, [this.state.modalIndex] : updatedReservation}})
    
  }

  editButton(cell, row, enumObject, rowIndex) {
    return (
       <Button
          type="button"
          onClick={() =>
          this.onClickEdit(cell, row, rowIndex)}
       >
       /
       </Button>
    )
  }

  modalCloseEdit() {
    this.setState({errorMsg: ""});
    this.setState({ modalType: this.modalEnum.NONE, modalIndex: -1});
  }

  modalOpenEdit(modalIndex) {
    this.setState({ modalType: this.modalEnum.EDIT, modalIndex: modalIndex});
    let modalStartTime = moment(this.props.reservations[modalIndex].start_date);
    let modalEndTime = moment(this.props.reservations[modalIndex].end_date);
    this.setState({ editOptions:
      {resourceType: this.props.reservations[modalIndex]["Resource.resource_type"],
      newStartTime: modalStartTime,
      newEndTime: modalEndTime}
    });
  }

  updateSelectedResource(option) {
    let newOptions = this.state.editOptions;
    newOptions.resourceType = option;
    this.setState({ editOptions: newOptions });
  }

  errorMessage() {
    if (this.state.errorMsg === "") return;
    return (
      <div className='error'>
        {this.state.errorMsg}
      </div>
    )
  }

  startTimeOptions() {
    if (this.state.modalIndex === -1) return;
    return (
      <div className='edit-start-time-container'>
        Start Time
        <br/>
        <DateTimePicker
          value={new Date(this.state.editOptions.newStartTime)}       
          onChange={this.changeStartTime.bind(this)}
          min={moment().startOf('hour').toDate()}
          max={moment().startOf('day').add(1, 'y').toDate()}
          step={60}
        />
      </div>
    )
  }

  changeStartTime(time) {
    let newOptions = this.state.editOptions;
    newOptions.newStartTime = time;
    this.setState({ editOptions: newOptions });
  }

  endTimeOptions() {
    if (this.state.modalIndex === -1) return;

    return (
      <div className='edit-end-time-container'>
        End Time
        <br/>
        <DateTimePicker
          value={new Date(this.state.editOptions.newEndTime)}
          onChange={this.changeEndTime.bind(this)}
          min={moment().startOf('hour').toDate()}
          max={moment().startOf('day').add(1, 'y').toDate()}
          step={60}
        />
      </div>
    )
  }

  changeEndTime(time) {
    let newOptions = this.state.editOptions;
    newOptions.newEndTime = time;
    this.setState({ editOptions: newOptions });
  }

  // Cancel Modal

  onClickCancel(cell, row, rowIndex){
    this.modalOpenCancel(rowIndex);
  }

  onClickConfirmCancel() {
    console.log("Reservation ID is: " + this.props.reservations[this.state.modalIndex].reservation_id);
    this.props.dispatch(cancelReservation(this.props.reservations[this.state.modalIndex].reservation_id, () => {
      this.props.dispatch(getAdminReservations())
    }));
    this.modalCloseCancel();
  }

  cancelButton(cell, row, enumObject, rowIndex) {
    return (
       <Button
          type="button"
          onClick={() =>
          this.onClickCancel(cell, row, rowIndex)}
       >
       X
       </Button>
    )
  }

  modalCloseCancel() {
    this.setState({ modalType: this.modalEnum.NONE, modalIndex: -1});
  }

  modalOpenCancel(modalIndex) {
    this.setState({ modalType: this.modalEnum.CANCEL, modalIndex: modalIndex});
  }
  
  csvDateFormatter(cell, row){
      return moment(cell).format("YYYY-MM-DD h:mma");
  }

  render() {
    var selectedResource = this.props.reservations[this.state.modalIndex] ? this.props.reservations[this.state.modalIndex]["Resource.Desk.desk_number"] : "";
    return (
      <div className='container tableContainer'>
      <Row/>
      <BootstrapTable exportCSV={true} csvFileName='reserved_resources.csv' 
      data={this.props.reservations} striped={true} hover={true} pagination options={{hideSizePerPage: true}}>
          <TableHeaderColumn width='50' dataField='reservation_id' isKey={true} dataAlign='center' dataSort={true}>Reservation ID</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='Resource.Desk.desk_number' dataAlign='center' dataSort={true}>Resource ID</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='Resource.resource_type' dataAlign='center' dataSort={true}>Resource Type</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='staff_id' dataAlign='center' dataSort={true}>Employee</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='start_date' dataAlign='center' dataSort={true} csvFormat={ this.csvDateFormatter} dataFormat={dateFormatter}>Start Time (d/m/y)</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='end_date' dataAlign='center' dataSort={true} csvFormat={ this.csvDateFormatter} dataFormat={dateFormatter}>End Time (d/m/y)</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='edit' dataAlign='center' export={false} dataFormat={this.editButton.bind(this)}>Edit</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='cancel' dataAlign='center' export={false} dataFormat={this.cancelButton.bind(this)}>Cancel</TableHeaderColumn>
      </BootstrapTable>

      <Modal show={(this.state.modalType === this.modalEnum.EDIT)} onHide={this.modalCloseEdit.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Reservation for Resource {selectedResource}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.errorMessage()}
            {this.startTimeOptions()}
            {this.endTimeOptions()}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.onClickConfirmEdit.bind(this)}>Save Changes</Button>
          </Modal.Footer>
      </Modal>

      <Modal show={(this.state.modalType === this.modalEnum.CANCEL)} onHide={this.modalCloseCancel.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel reservation for resource {selectedResource}?
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.onClickConfirmCancel.bind(this)}>Confirm</Button>
            <Button onClick={this.modalCloseCancel.bind(this)}>Cancel</Button>
          </Modal.Footer>
      </Modal>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps)(ReservedTableAdmin);
