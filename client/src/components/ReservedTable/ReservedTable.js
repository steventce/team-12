import React, { Component } from 'react';
import { div, button } from 'react-bootstrap';
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
      reservations: reservations
    };
  }

  onClickCancel(cell, row, rowIndex){
    console.log('Cancel', cell, row, rowIndex);
    console.log(this.state);
    this.setState(
      this.state.reservations.splice(rowIndex, 1)
    );
  }

  cancelButton(cell, row, enumObject, rowIndex) {
    return (
       <button 
          type="button" 
          onClick={() => 
          this.onClickCancel(cell, row, rowIndex)}
       >
       X
       </button>
    )
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
		  </BootstrapTable>,
		</div>
    );
  }
}

export default ReservedTable;