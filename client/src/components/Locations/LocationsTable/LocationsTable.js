import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { dateFormatter } from '../../../utils/formatter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import LocationsModal from '../LocationsModal';
import { modalTypes } from '../LocationsModal';


class LocationsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: this.props.employeeId,
      modal: { show: false, data: {}, modalType: modalTypes.NONE.name }
    };

    this.addButton = this.addButton.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.closeModal = this.setModalProps.bind(this, false, {}, modalTypes.NONE.name);
  }

  componentDidMount() {
    this.props.getLocations();
  }

  setModalProps(show, data, modalType) {
    this.setState({
      modal: { show, data, modalType }
    });
  }

  addButton() {
    return (
      <Button style={{marginLeft: '10px'}}
        onClick={this.setModalProps.bind(this, true, {}, modalTypes.ADD.name)}>
        Add Location
      </Button>
    )
  }

  editButton(cell, row, enumObject, rowIndex) {
    return (
      <Button
        onClick={this.setModalProps.bind(this, true, row, modalTypes.EDIT.name)}>
        Edit
      </Button>
    )
  }

  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <Button
        onClick={this.setModalProps.bind(this, true, row, modalTypes.DELETE.name)}>
        X
      </Button>
    );
  }

  renderModal(modal) {
    const { modalType } = modal;
    let okHandler = () => {};

    switch (modalType) {
      case modalTypes.ADD.name: {
        okHandler = this.props.addLocation;
        break;
      }
      case modalTypes.EDIT.name: {
        okHandler = this.props.editLocation;
        break;
      }
      case modalTypes.DELETE.name: {
        okHandler = this.props.deleteLocation;
        break;
      }
    }

    return (
      <LocationsModal
        {...modal}
        closeModal={this.closeModal}
        okHandler={okHandler}
      />
    );
  }

  formattedLocations (locations) {
    return locations.map((location) => {
      return {
        locationId: location.location_id,
        locationName: location.building_name,
        locationAddress: location.street_name +  ", " +  location.city + ", " + location.province_state + ", " + location.postal_code,
        editLocation: "Edit",
        deleteLocation: "x"
      };
    });
  }

  render() {
    const { modal } = this.state;
    const options = {
      hideSizePerPage: true
    };

    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Locations</h1>
        <div className='container tableContainer'>
          {this.addButton()}
          <BootstrapTable
            data={this.formattedLocations(this.props.locations)}
            striped
            hover
            options={options}>
            <TableHeaderColumn dataField='locationId' isKey={true} dataAlign='center'  width='100px' dataSort={true}>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='locationName' dataAlign='center' dataSort={true}>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='locationAddress' dataAlign='center' dataSort={true}>Address</TableHeaderColumn>
            <TableHeaderColumn dataField='editLocation' dataAlign='center' width='150px' dataFormat={this.editButton.bind(this)}></TableHeaderColumn>
            <TableHeaderColumn dataField='deleteLocation' dataAlign='center' width='100px' dataFormat={this.deleteButton.bind(this)}>Delete</TableHeaderColumn>
          </BootstrapTable>
        </div>
        {this.renderModal(modal)}
      </div>
    );
  }
}

export default LocationsTable;
