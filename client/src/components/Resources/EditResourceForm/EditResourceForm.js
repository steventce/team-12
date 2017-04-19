import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditResourceForm extends Component {
  render() {
    const { floor, section, deskNumber, handleChange, getValidationState } = this.props;
    return (
      <form>
        <FormGroup controlId="editFloor" validationState={getValidationState("floor")}>
          <ControlLabel>Floor</ControlLabel>
          <FormControl
            type="text"
            name="floor"
            value={floor}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editSection" validationState={getValidationState("section")}>
          <ControlLabel>Section</ControlLabel>
          <FormControl
            type="text"
            name="section"
            value={section}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editDeskNumber" validationState={getValidationState("deskNumber")}>
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
