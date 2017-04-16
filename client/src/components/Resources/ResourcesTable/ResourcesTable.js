import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { dateFormatter } from '../../../utils/formatter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ResourcesModal from '../ResourcesModal';
import { modalTypes } from '../ResourcesModal';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';

const locationId = 1;

function resourceIdFormatter(cell, row) {
  return cell ? `Booked by: ${cell}` : 'Available';
}

class ResourcesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: this.props.employeeId,
      modal: { show: false, data: {}, modalType: modalTypes.NONE.name }
    };

    this.addButton = this.addButton.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.setModalProps = this.setModalProps.bind(this);
    this.closeModal = () => {
      this.props.resetStatus();
      this.setModalProps(false, {}, modalTypes.NONE.name);
      this.props.getResources(locationId);
    };
  }

  componentDidMount() {
    this.props.getResources(locationId);
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
        Add Resource
      </Button>
    )
  }

  editButton(cell, row, enumObject, rowIndex) {
    return (
      <Button
        onClick={this.setModalProps.bind(this, true, row, modalTypes.EDIT.name)}>
        <EditIcon />
      </Button>
    )
  }

  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <Button
        onClick={this.setModalProps.bind(this, true, row, modalTypes.DELETE.name)}>
        <TrashIcon />
      </Button>
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
        locationId={locationId}
        {...modal}
        status={status}
        closeModal={this.closeModal}
        okHandler={okHandler}
        errors={errors}
      />
    );
  }

  render() {
    const { modal } = this.state;
    const options = {
      hideSizePerPage: true
    };
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Resources</h1>
        <div className='container tableContainer'>
          {this.addButton()}
          <BootstrapTable
            data={this.props.resources}
            striped
            hover
            pagination
            options={options}>
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
