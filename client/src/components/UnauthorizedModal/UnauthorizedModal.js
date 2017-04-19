import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class UnauthorizedModal extends Component {
  render() {
    return (
      <Modal style={{ maxWidth: "100vw" }} show={true} >
        <Modal.Header>
          <Modal.Title>Unauthorized access!</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <LinkContainer to="/home">
            <Button bsStyle="primary" id="successBtn">Ok</Button>
          </LinkContainer>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UnauthorizedModal;
