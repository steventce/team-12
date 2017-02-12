import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { div } from 'react-bootstrap';
import './Locations.css';
import AddLocationModal from './AddLocationModal.js';

class Locations extends Component {
  render() {

    var locations =
    [{
      locationName: 'Broadway Building Green',
      locationAddress: '2910 Virtual Way, Vancouver, BC, V5M 0B2',
      editLocation: 'Edit',
      deleteLocation: 'x'
    }];

    return (
      <div>
        <h2 className="text-center">Locations</h2>

        <div className='container tableContainer'>
          <BootstrapTable data={locations} striped={true} hover={true}>
              <TableHeaderColumn dataField='locationName' isKey={true} dataAlign='center' dataSort={true}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='locationAddress' dataAlign='center' dataSort={true}>Address</TableHeaderColumn>
              <TableHeaderColumn dataField='editLocation' dataAlign='center' width='150px'></TableHeaderColumn>
              <TableHeaderColumn dataField='deleteLocation' dataAlign='center' width='100px'>Delete?</TableHeaderColumn>
          </BootstrapTable>
        </div>

        <AddLocationModal></AddLocationModal>

       </div>
    );
  }
}

export default Locations;
