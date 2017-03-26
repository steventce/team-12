import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AddLocationForm from '../AddLocationForm';
import EditLocationForm from '../EditLocationForm';
import Loader from '../../Loader';


export const modalTypes = {
  NONE: {
    name: 'NONE'
  },
  ADD: {
    name: 'ADD',
    title: 'Add New Location',
    titleSuccess: 'Location created',
    body: (props) => <AddLocationForm {...props} />,
    okText: 'Add Location'
  },
  EDIT: {
    name: 'EDIT',
    title: 'Edit Location',
    titleSuccess: 'Location changes saved',
    body: (props) => <EditLocationForm {...props} />,
    okText: 'Save Changes'
  },
  DELETE: {
    name: 'DELETE',
    title: 'Confirm Delete Location',
    titleSuccess: 'Location deleted',
    body: () => <div>Are you sure you want to delete this location?</div>,
    okText: 'Delete'
  }
};

class LocationsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showModal: false,
      building_name: "",
      street_name: "",
      city: "",
      province_state: "",
      postal_code: ""
    };
    this.setData = this.setData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderConfirmModal = this.renderConfirmModal.bind(this);
  }

  setData() {
    const { data } = this.props;
      this.setState({
        buildingName: location.building_name || "",
        streetAddress: location.street_name || "",
        city: location.city || "",
        province_state: location.province_state || "",
        postal_code: location.postal_code || ""
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    let okHandler = this.props.okHandler;
    const { modalType, closeModal, locationId, data } = this.props;

    switch (modalType) {
      case modalTypes.ADD.name: {
        okHandler(this.state, this.state);
        break;
      }
      case modalTypes.EDIT.name: {
        okHandler(data.locationId, this.state);
        break;
      }
      case modalTypes.DELETE.name: {
        okHandler(data.locationId, this.state);
        break;
      }
    }
  }

  renderConfirmModal(props) {
    const { show, modalType, closeModal, status, errors } = props;
    const modalData = modalTypes[modalType];

    let title = null;
    let body = null;
    let footer = (
      <Modal.Footer>
        <Button bsStyle="primary" onClick={closeModal}>
          Ok
        </Button>
      </Modal.Footer>
    );

    switch (status) {
      case 'success': {
        title = modalData.titleSuccess;
        // No body
        break;
      }
      case 'error': {
        title = 'Error';
        body = (
          <Modal.Body>
            {errors.map((error, i) => {
              return (
                <p key={i}>{error.message}</p>
              );
            })}
          </Modal.Body>
        );
        break;
      }
      case 'loading': {
        title = 'Loading';
        body = (
          <Modal.Body>
            <Loader />
          </Modal.Body>
        );
        footer = null;
        break;
      }
    }

    return (
      <Modal show={show} onHide={closeModal} onEnter={this.setData}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        {body}
        {footer}
      </Modal>
    );
  }

  render() {
    const { show, modalType, closeModal, status, errors } = this.props;
    const modalData = modalTypes[modalType];

    if (modalType === modalTypes.NONE.name) {
      return <Modal show={false} />
    }

    if (status) {
      return this.renderConfirmModal(this.props);
    }

    return (
      <Modal show={show} onHide={closeModal} onEnter={this.setData}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData.body({
            ...this.state,
            handleChange: this.handleChange
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.handleSubmit}>
            {modalData.okText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LocationsModal;
