import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { div, Button, Modal } from 'react-bootstrap';
import './Locations.css';
import AddLocationModal from './AddLocationModal.js';
import EditLocationForm from './EditLocationForm.js'

class Locations extends Component {
  constructor(props){
        super(props);
        
        this.modalEnum = {
        NONE: -1,
        CANCEL: 0,
        EDIT: 1,
        }
      
        this.state = {
            modalIndex: -1,
            modalType:this.modalEnum.NONE
        }
    }
    
    onClickEdit(cell, row, rowIndex){
        this.modalEditOpen(rowIndex);
    }
    
    onClickCancel(cell,row,rowIndex){
        this.modalCancelOpen(rowIndex);
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
    
    modalEditOpen() {
        this.setState({modalType: this.modalEnum.EDIT});
    }
    modalEditClose() {
        this.setState({modalType: this.modalEnum.NONE, modalIndex: -1});
    }
    modalCancelOpen() {
        this.setState({modalType: this.modalEnum.CANCEL});
    }
    modalCancelClose() {
        this.setState({modalType: this.modalEnum.NONE, modalIndex: -1});
    }
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
        <h1 style={{textAlign: 'center'}}>Locations</h1>

        <div className='container tableContainer'>
          <BootstrapTable data={locations} striped={true} hover={true}>
              <TableHeaderColumn dataField='locationName' isKey={true} dataAlign='center' dataSort={true}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='locationAddress' dataAlign='center' dataSort={true}>Address</TableHeaderColumn>
              <TableHeaderColumn dataField='editLocation' dataAlign='center' width='150px' dataFormat={this.editButton.bind(this)}></TableHeaderColumn>
              <TableHeaderColumn dataField='deleteLocation' dataAlign='center' width='100px' dataFormat={this.cancelButton.bind(this)}>Delete?</TableHeaderColumn>
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
            <Button onClick={this.modalEditClose.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
        
        
        <Modal show={this.state.modalType === this.modalEnum.CANCEL} onHide={this.modalEditClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>

          <Modal.Body>
                Are you sure you want to cancel this location?
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.modalEditClose.bind(this)}>Confirm</Button>
            <Button onClick={this.modalCancelClose.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
          
          
        </div>
        
        
        

        <AddLocationModal></AddLocationModal>

       </div>
    );
  }
}

export default Locations;
