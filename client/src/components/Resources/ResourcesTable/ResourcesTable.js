import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { dateFormatter } from '../../../utils/formatter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ResourcesModal from '../ResourcesModal';
import { modalTypes } from '../ResourcesModal';

const locationId = 1;

class ResourcesTable extends Component {
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
        okHandler = this.props.addResource;
        break;
      }
      case modalTypes.EDIT.name: {
        okHandler = this.props.editResource;
        break;
      }
      case modalTypes.DELETE.name: {
        okHandler = this.props.deleteResource;
        break;
      }
    }

    return (
      <ResourcesModal
        locationId={locationId}
        {...modal}
        closeModal={this.closeModal}
        okHandler={okHandler}
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
            <TableHeaderColumn dataField='Desk.desk_number' isKey dataAlign='center' dataSort>Resource ID</TableHeaderColumn>
            <TableHeaderColumn dataField='resource_type' dataAlign='center' dataSort>Resource Type</TableHeaderColumn>
            <TableHeaderColumn dataField='Desk.floor' dataAlign='center' dataSort hidden>Floor</TableHeaderColumn>
            <TableHeaderColumn dataField='Desk.section' dataAlign='center' dataSort hidden>Section</TableHeaderColumn>
            <TableHeaderColumn dataField='Reservations.staff_id' dataAlign='center' dataSort>Staff Id</TableHeaderColumn>
            <TableHeaderColumn dataField='Reservations.staff_name' dataAlign='center' dataSort>Staff Name</TableHeaderColumn>
            <TableHeaderColumn dataField='Reservations.start_date' dataAlign='center' dataSort={true} dataFormat={dateFormatter}>Start Time (dd/mm/yyyy)</TableHeaderColumn>
            <TableHeaderColumn dataField='Reservations.end_date' dataAlign='center' dataSort={true} dataFormat={dateFormatter}>End Time (dd/mm/yyyy)</TableHeaderColumn>
            <TableHeaderColumn dataField='edit' dataAlign='center' dataFormat={this.editButton.bind(this)}>Edit</TableHeaderColumn>
            <TableHeaderColumn dataField='cancel' dataAlign='center' dataFormat={this.deleteButton.bind(this)}>Cancel</TableHeaderColumn>
          </BootstrapTable>
        </div>
        {this.renderModal(modal)}
      </div>
    );
  }
}

export default ResourcesTable;
