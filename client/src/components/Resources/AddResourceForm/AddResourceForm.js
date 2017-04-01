import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class AddResourceForm extends Component {
  getValidationState() {

  }

  render() {
    const { resource_type, floor, section, deskNumber, handleChange } = this.props;
    return (
      <form>
        <FormGroup controlId="addResourceType" validationState={this.getValidationState()}>
          <ControlLabel>Resource Type</ControlLabel>
          <FormControl
            componentClass="select"
            name="resource_type"
            onChange={handleChange}>
            <option value={resource_type}>Desk</option>
          </FormControl>
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="addFloor" validationState={this.getValidationState()}>
          <ControlLabel>Floor</ControlLabel>
          <FormControl
            type="text"
            name="floor"
            value={floor}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="addSection" validationState={this.getValidationState()}>
          <ControlLabel>Section</ControlLabel>
          <FormControl
            type="text"
            name="section"
            value={section}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="addDeskNumber" validationState={this.getValidationState()}>
          <ControlLabel>Desk Number</ControlLabel>
          <FormControl
            type="text"
            name="deskNumber"
            value={deskNumber}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}

export default AddResourceForm;
