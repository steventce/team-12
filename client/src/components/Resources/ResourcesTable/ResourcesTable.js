import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, FormGroup, FormControl } from 'react-bootstrap';
import { dateFormatter } from '../../../utils/formatter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ResourcesModal from '../ResourcesModal';
import { modalTypes } from '../ResourcesModal';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';
import UnauthorizedModal from '../../UnauthorizedModal';

function resourceIdFormatter(cell, row) {
  return cell ? `Booked by: ${cell}` : 'Available';
}

class ResourcesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationId: null,
      modal: { show: false, data: {}, modalType: modalTypes.NONE.name },
      isAdmin: true
    };

    this.addButton = this.addButton.bind(this);
    this.renderTableOptionsPanel = this.renderTableOptionsPanel.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.setModalProps = this.setModalProps.bind(this);
    this.closeModal = () => {
      this.props.resetStatus();
      this.setModalProps(false, {}, modalTypes.NONE.name);
      this.props.getResources(this.state.locationId);
    };
  }

  componentDidMount() {
    this.props.getLocations()
      .then((locations) => {
        const locationId = locations.payload[0].location_id;
        this.setState({ locationId })
        this.props.getResources(locationId);
      });
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
        Add Resource To Selected Location
      </Button>
    )
  }

  editButton(cell, row, enumObject, rowIndex) {
    return (
      <Button
        onClick={this.setModalProps.bind(this, true, row, modalTypes.EDIT.name)}>
        <EditIcon size={16} />
      </Button>
    )
  }

  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <Button
        onClick={this.setModalProps.bind(this, true, row, modalTypes.DELETE.name)}>
        <TrashIcon size={16} />
      </Button>
    );
  }

  renderTableOptionsPanel() {
    return (
      <Form inline>
        <FormGroup controlId="formControlsLocationSelect" style={{marginLeft: '10px'}}>
          <FormControl componentClass="select" onChange={(event) => {
            const locationId = event.target.value;
            this.setState({ locationId });
            this.props.getResources(locationId)
              .then(() => {
                const table = this.refs.table;
                table.reset();
                table.handlePaginationData(1, table.state.sizePerPage);
              });
          }} name="location">
            {this.props.locations.map(function (location) {
              const { building_name: name, location_id: id } = location;
              return (
                <option key={id} value={id}>{name}</option>
              );
            })}
          </FormControl>
        </FormGroup>
        {this.addButton()}
      </Form>
    );
  }

  renderModal(modal) {
    const { modalType } = modal;
    const { addResource, editResource, deleteResource, status, errors } = this.props;
    let okHandler = () => {};

    switch (modalType) {
      case modalTypes.ADD.name: {
        okHandler = addResource;
        break;
      }
      case modalTypes.EDIT.name: {
        okHandler = editResource;
        break;
      }
      case modalTypes.DELETE.name: {
        okHandler = deleteResource;
        break;
      }
    }

    return (
      <ResourcesModal
        locationId={this.state.locationId}
        {...modal}
        status={status}
        closeModal={this.closeModal}
        okHandler={okHandler}
        errors={errors}
      />
    );
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
        <h1 style={{textAlign: 'center'}}>Resources</h1>
        <div className='container tableContainer'>
          {this.renderTableOptionsPanel()}
          <BootstrapTable
            data={this.props.resources}
            striped
            hover
            pagination
            ref="table"
            options={options}>
            <TableHeaderColumn dataField='location_id' ref="locationId" filter={{ type: 'TextFilter' }} hidden></TableHeaderColumn>
            <TableHeaderColumn dataField='Desk.desk_number' isKey dataAlign='center' dataSort filter={{ type: 'TextFilter' }}>Resource ID</TableHeaderColumn>
            <TableHeaderColumn dataField='resource_type' dataAlign='center' dataSort>Resource Type</TableHeaderColumn>
            <TableHeaderColumn dataField='Desk.floor' dataAlign='center' dataSort hidden>Floor</TableHeaderColumn>
            <TableHeaderColumn dataField='Desk.section' dataAlign='center' dataSort hidden>Section</TableHeaderColumn>
            <TableHeaderColumn dataField='Reservations.resource_id' dataAlign='center' dataSort dataFormat={resourceIdFormatter}>Reservation Status</TableHeaderColumn>
            <TableHeaderColumn dataField='edit' dataAlign='center' dataFormat={this.editButton.bind(this)}>Edit</TableHeaderColumn>
            <TableHeaderColumn dataField='cancel' dataAlign='center' dataFormat={this.deleteButton.bind(this)}>Delete</TableHeaderColumn>
          </BootstrapTable>
        </div>
        {this.renderModal(modal)}
      </div>
    );
  }
}

export default ResourcesTable;
