import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditResourceForm extends Component {
  getValidationState() {

  }

  render() {
    const { floor, section, deskNumber, handleChange } = this.props;
    return (
      <form>
        <FormGroup controlId="editFloor" validationState={this.getValidationState()}>
          <ControlLabel>Floor</ControlLabel>
          <FormControl
            type="text"
            name="floor"
            value={floor}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editSection" validationState={this.getValidationState()}>
          <ControlLabel>Section</ControlLabel>
          <FormControl
            type="text"
            name="section"
            value={section}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editDeskNumber" validationState={this.getValidationState()}>
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

export default EditResourceForm;
