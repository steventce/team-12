import React, { Component } from 'react';
import {
  div,
  Row
} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.css';
import { dateFormatter } from '../../utils/formatter';
import moment from 'moment';
import './ReservedTable.css';

import { getUserReservations } from '../../redux/modules/ReservationReducer';
import { connect } from 'react-redux';

class ReservedTableRegularUser extends Component {

  constructor(props) {
    super(props);

    this.props.dispatch(getUserReservations()).then(function(response) {
    });
  }

  csvDateFormatter(cell, row){
      return moment(cell).format("YYYY-MM-DD h:mma");
  }

  render() {
    return (
      <div className='container tableContainer'>
      <Row/>
      <BootstrapTable exportCSV={true} csvFileName='user_reservations.csv'
      data={this.props.reservations} striped={true} hover={true} pagination options={{hideSizePerPage: true}}>
          <TableHeaderColumn width='50px' dataField='reservation_id' isKey={true} dataAlign='center' dataSort filter={{ type: 'TextFilter' }} dataSort={true}>Reservation ID</TableHeaderColumn>
          <TableHeaderColumn width='50px' dataField='Resource.Desk.desk_number' dataAlign='center' dataSort filter={{ type: 'TextFilter' }} dataSort={true}>Resource ID</TableHeaderColumn>
          <TableHeaderColumn width='50px' dataField='staff_id' dataAlign='center' dataSort filter={{ type: 'TextFilter' }} dataSort={true}>Employee ID</TableHeaderColumn>
          <TableHeaderColumn width='50px' dataField='staff_name' dataAlign='center' dataSort filter={{ type: 'TextFilter' }} dataSort={true}>Name</TableHeaderColumn>
          <TableHeaderColumn width='50px' dataField='Resource.resource_type' dataAlign='center' dataSort={true}>Resource Type</TableHeaderColumn>
          <TableHeaderColumn width='50px' dataField='start_date' dataAlign='center' dataSort={true} csvFormat={ this.csvDateFormatter} dataFormat={dateFormatter}>Start Time (d/m/y)</TableHeaderColumn>
          <TableHeaderColumn width='50px' dataField='end_date' dataAlign='center' dataSort={true} csvFormat={ this.csvDateFormatter} dataFormat={dateFormatter}>End Time (d/m/y)</TableHeaderColumn>
      </BootstrapTable>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps)(ReservedTableRegularUser);
