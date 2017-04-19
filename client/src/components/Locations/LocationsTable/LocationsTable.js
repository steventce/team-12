import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import LocationsModal from '../LocationsModal';
import { modalTypes } from '../LocationsModal';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';
import UnauthorizedModal from '../../UnauthorizedModal';

class LocationsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: this.props.employeeId,
      modal: { show: false, data: {}, modalType: modalTypes.NONE.name },
      isAdmin: true
    };

    this.addButton = this.addButton.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.setModalProps = this.setModalProps.bind(this);
    this.closeModal = () => {
      this.props.resetStatus();
      this.setModalProps(false, {}, modalTypes.NONE.name);
      this.props.getLocations();
    };
  }

  componentDidMount() {
    this.props.getLocations();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin){
      this.setState({ isAdmin: this.props.admin.length });
    }
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
      <Button style={{minWidth:"40px", minHeight:"40px"}}
        onClick={this.setModalProps.bind(this, true, row, modalTypes.EDIT.name)}>
        <EditIcon size={16} />
      </Button>
    )
  }

  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <Button style={{minWidth:"40px", minHeight:"40px"}}
        onClick={this.setModalProps.bind(this, true, row, modalTypes.DELETE.name)}>
        <TrashIcon size={16} />
      </Button>
    );
  }

  renderModal(modal) {
    const { modalType } = modal;
    const { addLocation, editLocation, deleteLocation, status, errors } = this.props;
    let okHandler = () => {};

    switch (modalType) {
      case modalTypes.ADD.name: {
        okHandler = addLocation;
        break;
      }
      case modalTypes.EDIT.name: {
        okHandler = editLocation;
        break;
      }
      case modalTypes.DELETE.name: {
        okHandler = deleteLocation;
        break;
      }
    }

    return (
      <LocationsModal
        {...modal}
        status={status}
        closeModal={this.closeModal}
        okHandler={okHandler}
        errors={errors}
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
        streetName: location.street_name,
        city: location.city,
        provinceState: location.province_state,
        postalCode: location.postal_code
      };
    });
  }

  render() {
    // restrict access if not an admin
    if (!this.state.isAdmin) {
      return (
        <UnauthorizedModal />
      );
    }
    
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
            pagination
            options={options}>
            <TableHeaderColumn dataField='locationId' isKey={true} dataAlign='center' dataSort={true}>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='locationName' dataAlign='center' dataSort={true}>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='locationAddress' dataAlign='center' dataSort={true}>Address</TableHeaderColumn>
            <TableHeaderColumn dataField='editLocation' dataAlign='center' dataFormat={this.editButton.bind(this)}>Edit</TableHeaderColumn>
            <TableHeaderColumn dataField='deleteLocation' dataAlign='center' dataFormat={this.deleteButton.bind(this)}>Delete</TableHeaderColumn>
          </BootstrapTable>
        </div>
        {this.renderModal(modal)}
      </div>
    );
  }
}

export default LocationsTable;
