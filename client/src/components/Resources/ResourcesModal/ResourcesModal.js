import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AddResourceForm from '../AddResourceForm';
import EditResourceForm from '../EditResourceForm';

export const modalTypes = {
  NONE: {
    name: 'NONE'
  },
  ADD: {
    name: 'ADD',
    title: 'Add New Resource',
    body: (props) => <AddResourceForm {...props} />,
    okText: 'Add Resource'
  },
  EDIT: {
    name: 'EDIT',
    title: 'Edit Resource',
    body: (props) => <EditResourceForm {...props} />,
    okText: 'Save Changes'
  },
  DELETE: {
    name: 'DELETE',
    title: 'Confirm Delete Resource',
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
    closeModal();
  }

  render() {
    const { show, modalType, closeModal } = this.props;

    if (modalType === modalTypes.NONE.name) {
      return <Modal show={false} />
    }

    return (
      <Modal show={show} onHide={closeModal} onEnter={this.setData}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTypes[modalType].title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTypes[modalType].body({
            ...this.state,
            handleChange: this.handleChange
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.handleSubmit}>
            {modalTypes[modalType].okText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ResourcesModal;
