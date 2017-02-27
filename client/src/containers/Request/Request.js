import React, { Component } from 'react';
import {
  Col,
  Form,
  ControlLabel,
  FormControl,
  FormGroup,
  Radio,
  Grid,
  Row
} from 'react-bootstrap';
import StaticMapImg from '../../images/Capture.PNG';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css';
import { DATE_TIME_FORMAT } from '../../utils/formatter';
import ConfirmRequestModal from '../../components/ConfirmRequestModal';

momentLocalizer(moment);

class Request extends Component {
  render() {
    const {
      floor,
      floors,
      sections,
      selectedResourceId,
      selectedResourceName,
      resourceTypes,
      startDate,
      endDate,
    } = this.props;

    return (
      <Grid>
        <Row>
          <h1 className="text-center">Request a Resource</h1>
        </Row>

        <Form>
          {/* Select floor and section */}
          <Row className="show-grid">
            <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsFloorSelect">
                <ControlLabel>Select Resource Type</ControlLabel>
                <FormControl componentClass="select" disabled={true} onChange={this.props.onChange} name="resourceType">
                  {resourceTypes.map(function (type) {
                    return (
                      <option key={type} value={type}>{type}</option>
                    );
                  })}
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsFloorSelect">
                <ControlLabel>Select a Floor</ControlLabel>
                <FormControl componentClass="select" onChange={this.props.onChange} name="floor">
                  {floors.map(function (floor) {
                    return (
                      <option key={floor} value={floor}>Floor {floor}</option>
                    );
                  })}
                </FormControl>
              </FormGroup>
            </Col>
            <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsSectionSelect">
                <ControlLabel>Select a Section</ControlLabel>
                <FormControl componentClass="select" placeholder="select" onChange={this.props.onChange} name="section">
                  <option value="">All</option>
                  {sections.map(function (section) {
                    return (
                      <option key={section} value={section}>{section}</option>
                    );
                  })}
                </FormControl>
              </FormGroup>
            </Col>
          </Row>

          {/* Choose date and time */}
          <Row className="show-grid">
            <Col xs={12} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsFloorSelect">
                <ControlLabel>From</ControlLabel>
                <DateTimePicker
                  value={startDate}
                  format={DATE_TIME_FORMAT}
                  onChange={this.props.onStartDateChange}
                  min={moment().startOf('hour').toDate()}
                  max={moment().startOf('day').add(1, 'y').toDate()}
                  step={60}
                />
              </FormGroup>
            </Col>

            <Col xs={12} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsSectionSelect">
                <ControlLabel>To</ControlLabel>
                <DateTimePicker
                  value={endDate}
                  format={DATE_TIME_FORMAT}
                  onChange={this.props.onEndDateChange}
                  min={moment().add(1, 'h').startOf('hour').toDate()}
                  max={moment().add(1, 'y').startOf('day').toDate()}
                  step={60}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* ImageMap and specific resource */}
          <Row className="show-grid">
            <Col xs={12} md={8}>
              <img role="presentation" src={StaticMapImg} style={{ height: "100%", width: "100%", border: "thin solid black" }} />
            </Col>
            <Col xs={6} md={4}>
              <div style={{ border: "thin solid black" }}>
                <div><b>Available Resources</b></div>
                {/* TODO: dynamically allocate size */}
                <div style={{ height: "200px", overflowY: "auto" }}>
                  {
                    this.props.availableResources.map((resource, index) => {
                      const { resource_id } = resource;
                      return (
                        <Radio
                          key={resource_id}
                          name="resources"
                          value={resource_id}
                          checked={resource_id === selectedResourceId}
                          onChange={this.props.onResourceSelect.bind(null, resource)}>
                          {resource.Desk.desk_number}
                        </Radio>
                      );
                    })
                  }
                </div>
              </div>
            </Col>
          </Row>

          {/* Email option */}
          <Row className="show-grid" style={{ marginTop: '20px' }}>
            <Col xs={12} md={4}>
              <ControlLabel>Email (Optional)</ControlLabel>
              <FormControl type="email" label="Email (Optional)" placeholder="Email">
              </FormControl>
            </Col>
          </Row>

          {/* Submit button */}
          <Row className="show-grid" style={{ marginTop: '20px' }}>
            <Col xs={2} md={2}>
              <ConfirmRequestModal {...this.props} handleSubmit={this.props.submitClick} />
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default Request;
