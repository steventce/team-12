import React, { Component } from 'react';
import { div, Modal, Button, OverlayTrigger, Tooltip, Popover, Grid, Row, Col, ButtonToolbar } from 'react-bootstrap';
import EditLocationForm from './EditLocationForm.js'

const EditLocationModal = React.createClass({
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
            <EditLocationForm></EditLocationForm>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

export default EditLocationModal;