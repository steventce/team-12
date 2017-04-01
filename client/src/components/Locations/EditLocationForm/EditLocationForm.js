import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditLocationForm extends Component {

  getValidationState() {
//    const length = this.state.value.length;
//    if (length > 10) return 'success';
//    else if (length > 5) return 'warning';
//    else if (length > 0) return 'error';
  }

  render() {
    const { building_name, street_name, city, province_state, postal_code, handleChange } = this.props;
    return (
      <form>
        <FormGroup controlId="editBuildingName" validationState={this.getValidationState()}>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            name="building_name"
            value={building_name}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editLocationStreetName" validationState={this.getValidationState()}>
          <ControlLabel>Street Address</ControlLabel>
          <FormControl
            type="text"
            name="street_name"
            value={street_name}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editLocationCity" validationState={this.getValidationState()}>
          <ControlLabel>City</ControlLabel>
          <FormControl
            type="text"
            name="city"
            value={city}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editLocationProvinceState" validationState={this.getValidationState()}>
          <ControlLabel>Province/State</ControlLabel>
          <FormControl
            type="text"
            name="province_state"
            value={province_state}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="editLocationPostalZIPCode" validationState={this.getValidationState()}>
          <ControlLabel>Postal/ZIP Code</ControlLabel>
          <FormControl
            type="text"
            name="postal_code"
            value={postal_code}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}

export default EditLocationForm;
