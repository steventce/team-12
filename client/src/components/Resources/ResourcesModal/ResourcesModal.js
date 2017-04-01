import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AddResourceForm from '../AddResourceForm';
import EditResourceForm from '../EditResourceForm';
import Loader from '../../Loader';

export const modalTypes = {
  NONE: {
    name: 'NONE'
  },
  ADD: {
    name: 'ADD',
    title: 'Add New Resource',
    titleSuccess: 'Resource created',
    body: (props) => <AddResourceForm {...props} />,
    okText: 'Add Resource'
  },
  EDIT: {
    name: 'EDIT',
    title: 'Edit Resource',
    titleSuccess: 'Resource changes saved',
    body: (props) => <EditResourceForm {...props} />,
    okText: 'Save Changes'
  },
  DELETE: {
    name: 'DELETE',
    title: 'Confirm Delete Resource',
    titleSuccess: 'Resource deleted',
    body: () => <div>Are you sure you want to delete this resource?</div>,
    okText: 'Delete'
  }
};

class ResourcesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceType: 'Desk',
      floor: '',
      section: '',
      deskNumber: ''
    };
    this.setData = this.setData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderConfirmModal = this.renderConfirmModal.bind(this);
  }

  setData() {
    const { data } = this.props;
    const deskNumber = data['Desk.desk_number'] ? data['Desk.desk_number'].split('.').slice(-1)[0] : ''
    this.setState({
      resourceType: 'Desk',
      floor: data['Desk.floor'] || '',
      section: data['Desk.section'] || '',
      deskNumber
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
        okHandler(locationId, this.state);
        break;
      }
      case modalTypes.EDIT.name: {
        okHandler(data.resource_id, this.state);
        break;
      }
      case modalTypes.DELETE.name: {
        okHandler(data.resource_id, this.state);
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

export default ResourcesModal;
