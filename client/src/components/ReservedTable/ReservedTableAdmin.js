import React, { Component } from 'react';
import { div, Button, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DropdownButton, MenuItem} from 'react-bootstrap';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import './ReservedTable.css';
import './ReservedTableAdmin.css';

const reservations = 
    [{
      resourceId: '1A101',
      resourceType: 'Desk',
      employeeId: '123456',
      startTime: '2:00 PM 01/12/17',
      endTime: '6:00 PM 01/12/17',
      edit: 'edit',
      cancel: 'X'
    },
    {
      resourceId: '1B102',
      resourceType: 'Desk',
      employeeId: '142353',
      startTime: '2:00 PM 01/13/17',
      endTime: '5:00 PM 01/13/17',
      edit: 'edit',
      cancel: 'X'
    },
    {
      resourceId: '1C104',
      resourceType: 'Desk',
      employeeId: '326454',      
      startTime: '2:00 AM 01/14/17',
      endTime: '5:00 PM 01/14/17',
      edit: 'edit',
      cancel: 'X'
    },
    {
      resourceId: '1D105',
      resourceType: 'Desk',
      employeeId: '323566',      
      startTime: '2:00 PM 01/15/17',
      endTime: '5:00 PM 01/15/17',
      edit: 'edit',
      cancel: 'X'
    },
    {
      resourceId: '2B111',
      resourceType: 'Desk',
      employeeId: '222564',      
      startTime: '11:00 AM 01/16/17',
      endTime: '5:00 PM 01/17/17',
      edit: 'edit',
      cancel: 'X'
    },
    {
      resourceId: '2C106',
      resourceType: 'Desk',
      employeeId: '231556',      
      startTime: '2:00 PM 01/17/17',
      endTime: '5:00 PM 01/17/17',
      edit: 'edit',
      cancel: 'X'
    }];

const resourceTypes = ['Desk', 'Chair', 'Phone'];

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
      reservations: reservations,
      modalIndex: -1,
      modalType: this.modalEnum.NONE,
      editOptions: this.editOptions
    };
  }

  // Edit Modal

  onClickEdit(cell, row, rowIndex){
    this.modalOpenEdit(rowIndex);
  }

  onClickConfirmEdit(){
    let updatedReservation = this.state.reservations[this.state.modalIndex];
    let editedOptions = this.state.editOptions;
    updatedReservation.resourceType = editedOptions.resourceType;
    updatedReservation.startTime = moment(editedOptions.newStartTime).format("h:mm a MM/DD/YY");
    updatedReservation.endTime = moment(editedOptions.newEndTime).format("h:mm a MM/DD/YY");
    this.state.reservations[this.state.modalIndex] = updatedReservation;
    this.modalCloseEdit();
  }

  editButton(cell, row, enumObject, rowIndex) {
    return (
       <Button 
          type="button" 
          onClick={() => 
          this.onClickEdit(cell, row, rowIndex)}
       >
       Edit
       </Button>
    )
  }

  modalCloseEdit() {
    this.setState({ modalType: this.modalEnum.NONE, modalIndex: -1});
  }

  modalOpenEdit(modalIndex) {
    this.setState({ modalType: this.modalEnum.EDIT, modalIndex: modalIndex});
    this.setState({ editOptions: 
      {resourceType: this.state.reservations[modalIndex].resourceType,
      newStartTime: this.state.reservations[modalIndex].startTime,
      newEndTime: this.state.reservations[modalIndex].endTime}
    });
  }

  updateSelectedResource(option) {
    let editOptions = this.state.editOptions;
    editOptions.resourceType = option;
    this.setState(editOptions: editOption);
  }

  dropDown(title, i) {
    if (this.state.modalIndex !== -1) {
      let resourceMenuItems = resourceTypes.map(function(option, i) {
        return (
          <MenuItem key={i} eventKey={option}>{option}</MenuItem>
        )
      });
      return (
        <div className='edit'>
          Type
          <br/>
          <DropdownButton title={this.state.editOptions.resourceType} id='resourceDropdown' 
          onSelect={this.updateSelectedResource.bind(this)}>
            {resourceMenuItems}
          </DropdownButton>
        </div>
      )
    }
  }

  startTimeOptions() {
    if (this.state.modalIndex === -1) return;
    // this.changeStartTime(this.state.startTime);
    return (
      <div className='edit'>
        StartTime
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
    let editOptions = this.state.editOptions;
    editOptions.newStartTime = time;
    this.setState(editOptions: editOption);
  }

  endTimeOptions() {
    if (this.state.modalIndex === -1) return;
    
    return (
      <div className='edit'>
        EndTime
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
    let editOptions = this.state.editOptions;
    editOptions.newEndTime = time;
    this.setState(editOptions: editOption);
  }

  // Cancel Modal

  onClickCancel(cell, row, rowIndex){
    this.modalOpenCancel(rowIndex);
  }

  onClickConfirmCancel(){
    this.setState(
      this.state.reservations.splice(this.state.modalIndex, 1)
    );
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

  // Dropdown

  render() {
    return (
      <div className='container tableContainer'>
      <BootstrapTable data={this.state.reservations} striped={true} hover={true}>
          <TableHeaderColumn dataField='resourceId' isKey={true} dataAlign='center' dataSort={true}>Resource ID</TableHeaderColumn>
          <TableHeaderColumn dataField='resourceType' dataAlign='center' dataSort={true}>Resource Type</TableHeaderColumn>
          <TableHeaderColumn dataField='employeeId' dataAlign='center' dataSort={true}>Employee</TableHeaderColumn>
          <TableHeaderColumn dataField='startTime' dataSort={true}>Start Time (dd/mm/yyy)</TableHeaderColumn>
          <TableHeaderColumn dataField='endTime' dataSort={true}>End Time (dd/mm/yyy)</TableHeaderColumn>
          <TableHeaderColumn dataField='edit' dataFormat={this.editButton.bind(this)}></TableHeaderColumn>
          <TableHeaderColumn dataField='cancel' dataFormat={this.cancelButton.bind(this)}>Cancel</TableHeaderColumn>
      </BootstrapTable>

      <Modal show={(this.state.modalType === this.modalEnum.EDIT)} onHide={this.modalCloseEdit.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Resource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.dropDown()}
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
              Are you sure you want to cancel this reservation?
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

export default ReservedTableAdmin;