import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { div, Button, Modal } from 'react-bootstrap';
import './Locations.css';
import AddLocationModal from './AddLocationModal.js';
import EditLocationForm from './EditLocationForm.js'
import { connect } from 'react-redux';
import { getLocations, addLocation, editLocation, deleteLocation } from '../../../redux/modules/LocationReducer';

class Locations extends Component {

  constructor(props) {
    super(props);

    this.modalEnum = {
      NONE: -1,
      DELETE: 0,
      EDIT: 1,
    }

    this.state = {
      modalIndex: -1,
      modalType:this.modalEnum.NONE
    }

    this.props.dispatch(getLocations());
    }

    // Edit Modal

    modalEditOpen() {
      this.setState({modalType: this.modalEnum.EDIT});
    }

    modalEditClose() {
      this.setState({modalType: this.modalEnum.NONE, modalIndex: -1});
    }

    onClickEdit(cell, row, rowIndex){
      this.modalEditOpen(rowIndex);
    }

    editButton(cell, row, enumObject, rowIndex) {
      return (
         <Button
            type="button"
            onClick={() =>
            this.onClickEdit(cell, row, rowIndex)}
         >
         Edit
       </Button>
      )
    }

    // Delete Modal

    onClickDelete(cell, row, rowIndex){
      this.modalDeleteOpen(rowIndex);
    }

    deleteButton(cell, row, enumObject, rowIndex) {
      return (
        <Button
          type="button"
          onClick={() =>
          this.onClickDelete(cell, row, rowIndex)}
        >
        X
       </Button>
      )
    }

    modalDeleteOpen(modalIndex) {
      this.setState({ modalType: this.modalEnum.DELETE, modalIndex: modalIndex});
    }

    modalDeleteClose() {
      this.setState({modalType: this.modalEnum.NONE, modalIndex: -1});
    }

    onClickDeleteLocation() {
        this.props.dispatch(deleteLocation(this.props.locations[this.state.modalIndex].location_id, () => {
          this.props.dispatch(getLocations())
        }));
        this.modalDeleteClose();
    }



    formattedLocations (locations) {
      return locations.map((location) => {
        return {
          locationName: location.building_name,
          locationAddress: location.street_name +  ", " +  location.city + ", " + location.province_state + ", " + location.postal_code,
          editLocation: "Edit",
          deleteLocation: "x"
        };
      });
    }

  render() {

    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Locations</h1>

        <div className='container tableContainer'>
          <BootstrapTable data={this.formattedLocations(this.props.locations)} striped={true} hover={true}>
            <TableHeaderColumn dataField='locationName' isKey={true} dataAlign='center' dataSort={true}>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='locationAddress' dataAlign='center' dataSort={true}>Address</TableHeaderColumn>
            <TableHeaderColumn dataField='editLocation' dataAlign='center' width='150px' dataFormat={this.editButton.bind(this)}></TableHeaderColumn>
            <TableHeaderColumn dataField='deleteLocation' dataAlign='center' width='100px' dataFormat={this.deleteButton.bind(this)}>Delete</TableHeaderColumn>
          </BootstrapTable>


          <Modal show={this.state.modalType === this.modalEnum.EDIT} onHide={this.modalEditClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Location</Modal.Title>
          </Modal.Header>

          <Modal.Body>
          <EditLocationForm></EditLocationForm>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.modalEditClose.bind(this)}>Save Changes</Button>
            <Button onClick={this.modalEditClose.bind(this)}>Delete</Button>
          </Modal.Footer>
        </Modal>


        <Modal show={this.state.modalType === this.modalEnum.DELETE} onHide={this.modalDeleteClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deleting Location</Modal.Title>
          </Modal.Header>

          <Modal.Body>
                Are you sure you want to delete this location?
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.onClickDeleteLocation.bind(this)}>Confirm</Button>
            <Button onClick={this.modalDeleteClose.bind(this)}>Delete</Button>
          </Modal.Footer>
        </Modal>

        </div>

        <AddLocationModal></AddLocationModal>

       </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.locations };
}

export default connect(mapStateToProps)(Locations);
