import React, { Component } from 'react';
import { div, Button, Modal } from 'react-bootstrap';
import { dateFormatter } from '../../utils/formatter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './ReservedTable.css';

import { cancelReservation, getReservations } from '../../redux/modules/ReservationReducer';
import { connect } from 'react-redux';

class ReservedTable extends Component {

  constructor(props){
    super(props);

    this.state = {
      showModal: false,
      cancelIndex: -1,
      employeeId: this.props.employeeId,
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
		  <BootstrapTable data={this.props.reservations} striped={true} hover={true}>
		      <TableHeaderColumn dataField='Resource.Desk.desk_number' isKey={true} dataAlign='center' dataSort={true}>Resource ID</TableHeaderColumn>
		      <TableHeaderColumn dataField='Resource.resource_type' dataAlign='center' dataSort={true}>Resource Type</TableHeaderColumn>
		      <TableHeaderColumn dataField='start_date' dataAlign='center' dataSort={true} dataFormat={dateFormatter}>Start Time (dd/mm/yyyy)</TableHeaderColumn>
		      <TableHeaderColumn dataField='end_date' dataAlign='center' dataSort={true} dataFormat={dateFormatter}>End Time (dd/mm/yyyy)</TableHeaderColumn>
		      <TableHeaderColumn dataField='cancel' dataAlign='center' dataFormat={this.cancelButton.bind(this)}>Cancel</TableHeaderColumn>
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

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps)(ReservedTable);
