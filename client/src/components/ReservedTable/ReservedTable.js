import React, { Component } from 'react';
import { div, Button, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './ReservedTable.css';

const reservations = 
    [{
      resourceId: '1A101',
      resourceType: 'Desk',
      startTime: '2:00 pm 01/12/17',
      endTime: '5:00 pm 01/12/17',
      cancel: 'X'
    },
    {
      resourceId: '1B102',
      resourceType: 'Desk',
      startTime: '2:00 pm 01/13/17',
      endTime: '5:00 pm 01/13/17',
      cancel: 'X'
    },
    {
      resourceId: '1C104',
      resourceType: 'Desk',
      startTime: '2:00 pm 01/14/17',
      endTime: '5:00 pm 01/14/17',
      cancel: 'X'
    },
    {
      resourceId: '1D105',
      resourceType: 'Desk',
      startTime: '2:00 pm 01/15/17',
      endTime: '5:00 pm 01/15/17',
      cancel: 'X'
    },
    {
      resourceId: '2B111',
      resourceType: 'Desk',
      startTime: '2:00 pm 01/16/17',
      endTime: '5:00 pm 01/16/17',
      cancel: 'X'
    },
    {
      resourceId: '2C106',
      resourceType: 'Desk',
      startTime: '2:00 pm 01/17/17',
      endTime: '5:00 pm 01/17/17',
      cancel: 'X'
    }];

class ReservedTable extends Component {

  constructor(props){
    super(props);

    this.state = {
      reservations: reservations,
      showModal: false,
      cancelIndex: -1
    };
  }

  onClickCancel(cell, row, rowIndex){
    this.modalOpen(rowIndex);
  }

  onClickConfirmCancel(){
    this.setState(
      this.state.reservations.splice(this.state.cancelIndex, 1)
    );
    this.modalClose();
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

  modalClose() {
    this.setState({ showModal: false, cancelIndex: -1});
  }

  modalOpen(cancelIndex) {
    this.setState({ showModal: true, cancelIndex: cancelIndex});
  }

  render() {
    return (
    	<div className='container tableContainer'>
		  <BootstrapTable data={this.state.reservations} striped={true} hover={true}>
		      <TableHeaderColumn dataField='resourceId' isKey={true} dataAlign='center' dataSort={true}>Resource ID</TableHeaderColumn>
		      <TableHeaderColumn dataField='resourceType' dataSort={true}>Resource Type</TableHeaderColumn>
		      <TableHeaderColumn dataField='startTime' dataSort={true}>Start Time (dd/mm/yyy)</TableHeaderColumn>
		      <TableHeaderColumn dataField='endTime' dataSort={true}>End Time (dd/mm/yyy)</TableHeaderColumn>
		      <TableHeaderColumn dataField='cancel' dataFormat={this.cancelButton.bind(this)}>Cancel</TableHeaderColumn>
		  </BootstrapTable>
      <Modal show={this.state.showModal} onHide={this.modalClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this reservation?
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

export default ReservedTable;