import React, { Component } from 'react';
import { div, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const EditLocationForm = React.createClass({
  getInitialState() {
    return {
      value: ''
    };
  },

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  },

  handleChange(e) {
    this.setState({ value: e.target.value });
  },

  render() {
    return (
      <form>
        <FormGroup controlId="newLocationName" validationState={this.getValidationState()}>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationStreetAddress" validationState={this.getValidationState()}>
          <ControlLabel>Street Address</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationCity" validationState={this.getValidationState()}>
          <ControlLabel>City</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationProvinceState" validationState={this.getValidationState()}>
          <ControlLabel>Province/State</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="newLocationProvinceState" validationState={this.getValidationState()}>
          <ControlLabel>Postal/ZIP Code</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

      </form>
    );
  }
});

export default EditLocationForm;