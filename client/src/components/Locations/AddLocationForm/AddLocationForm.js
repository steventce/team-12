import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class AddLocationForm extends Component {
  render() {
    const { building_name, street_name, city, province_state, postal_code, handleChange, getValidationState } = this.props;
    return (
      <form>
        <FormGroup controlId="newBuildingName" validationState={getValidationState("building_name")}>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            name="building_name"
            value={building_name}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationStreetAddress" validationState={getValidationState("street_name")}>
          <ControlLabel>Street Address</ControlLabel>
          <FormControl
            type="text"
            name="street_name"
            value={street_name}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationCity" validationState={getValidationState("city")}>
          <ControlLabel>City</ControlLabel>
          <FormControl
            type="text"
            name="city"
            value={city}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationProvinceState" validationState={getValidationState("province_state")}>
          <ControlLabel>Province/State</ControlLabel>
          <FormControl
            type="text"
            name="province_state"
            value={province_state}
            onChange={handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationPostalZIPCode" validationState={getValidationState("postal_code")}>
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
};

export default AddLocationForm;