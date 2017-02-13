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
import { connect } from 'react-redux';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css';
import ConfirmRequestModal from './ConfirmRequestModal';
import { makeReservation } from '../../redux/modules/RequestReducer';

// TODO: remove these and use props from db
const SectionArr = ['All', 'A', 'B', 'C', 'D', 'E'];
const ResourceTypeArr = ['Desk']

momentLocalizer(moment);

class Request extends Component {
  constructor(props) {
    super(props);

    // TODO: selectedResource should be by db's resourceId field and not index or name
    // TODO: initial type and floorNum could be based on result returned by db and not hardcoded
    this.state = {
      resourceType: 'Desk',
      floorNum: 1,
      section: '',
      selectedResource: '-1',
      selectedResourceName: '',
      email: '',
      startDateTime: moment().startOf('hour').toDate(),
      endDateTime: moment().add(1, 'h').startOf('hour').toDate()
    };

    this.testFunc = this.submitClick.bind(this);
  }

  onStartDateChange(startDateTime) {
    this.setState({
      startDateTime
    });
  }

  onEndDateChange(endDateTime) {
    this.setState({
      endDateTime
    });
  }

  onResourceSelect(event) {
    this.setState({
      selectedResource: event.currentTarget.value,
      selectedResourceName: this.props.resources[this.state.floorNum-1][Number(event.currentTarget.value)]
    });
  }

  onFloorNumChange(event) {
    this.setState({
      floorNum: event.target.value,
      selectedResource: '-1'
    });
  }

  submitClick() {
     this.props.dispatch(makeReservation({...this.state, 
     resourceId: this.state.selectedResourceName/*TODO: use resourceId from server*/}, this.props.employeeId));
  }

  render() {
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
                  {ResourceTypeArr.map(function (type) {
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
                <FormControl componentClass="select" onChange={this.onFloorNumChange.bind(this)}>
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
                  {SectionArr.map(function (value) {
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
                  value={this.state.startDateTime}
                  onChange={this.onStartDateChange.bind(this)}
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
                  value={this.state.endDateTime}
                  onChange={this.onEndDateChange.bind(this)}
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
                    this.props.resources[this.state.floorNum - 1].map((value, index) => {
                      return (
                        <Radio
                          key={index}
                          name="resources"
                          value={String(index)}
                          checked={String(index) === this.state.selectedResource}
                          onChange={this.onResourceSelect.bind(this)}>
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
              <ConfirmRequestModal {...this.state} handleSubmit={this.submitClick.bind(this)} />
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps)(Request);
