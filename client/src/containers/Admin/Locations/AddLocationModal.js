import React, { Component } from 'react';
import { div, Modal, Button, OverlayTrigger, Tooltip, Popover, Grid, Row, Col, ButtonToolbar } from 'react-bootstrap';
import AddLocationForm from './AddLocationForm.js'

const AddLocationModal = React.createClass({
  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  render() {

    return (
      <div>

        <Grid>
          <Row className="show-grid">
            <Col md={2}>
              <ButtonToolbar className='addLocationBtnContainer'>
                <Button onClick={this.open}>Add New Location</Button>
              </ButtonToolbar>
            </Col>
          </Row>
         </Grid>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Location</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <AddLocationForm></AddLocationForm>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.close}>Add Location</Button>
            <Button onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

export default AddLocationModal;