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

// TODO: remove these and use props from db
const sections = ['All', 'A', 'B', 'C', 'D', 'E'];
const resourceTypes = ['Desk']

momentLocalizer(moment);

class Request extends Component {
  render() {
    const {
      floorNum,
      selectedResource,
      startDateTime,
      endDateTime
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
                <ControlLabel>Select resource type</ControlLabel>
                <FormControl componentClass="select" disabled={true}>
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
                <FormControl componentClass="select" onChange={this.props.onFloorNumChange}>
                  {this.props.resources.map(function (_, index) {
                    return (
                      <option key={index + 1} value={index + 1}>Floor {index + 1}</option>
                    );
                  })}
                </FormControl>
              </FormGroup>
            </Col>
            <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsSectionSelect">
                <ControlLabel>Select a Section</ControlLabel>
                <FormControl componentClass="select" disabled={true} placeholder="select">
                  {sections.map(function (value) {
                    return (
                      <option key={value} value="other">{value}</option>
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
                  value={startDateTime}
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
                  value={endDateTime}
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
                    this.props.resources[floorNum - 1].map((value, index) => {
                      return (
                        <Radio
                          key={index}
                          name="resources"
                          value={String(index)}
                          checked={String(index) === selectedResource}
                          onChange={this.props.onResourceSelect}>
                        {value}
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
