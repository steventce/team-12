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
import { selectResource } from '../../redux/modules/Request';

// TODO: remove these and use props
const FloorNumArr = [1, 2, 3, 4, 5];
const SectionArr = ["A", "B", "C", "D", "E"];
const DeskArr = ["1.A.101", "1.A.102", "1.A.103", "1.A.104", "1.A.105", "1.A.106", "1.A.107", "1.A.108", "1.A.109", "1.A.110"]

momentLocalizer(moment);

class Request extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floorNum: '',
      section: '',
      selectedResource: '',
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
      selectedResource: event.currentTarget.value
    });
  }

  submitClick() {
    // TODO
  }

  handleClick() {
    this.props.dispatch(selectResource({ id: 1 }));
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
                <ControlLabel>Select a Floor</ControlLabel>
                <FormControl componentClass="select">
                  {FloorNumArr.map(function (value) {
                    return (
                      <option key={value} value="other">{value}</option>
                    );
                  })}
                </FormControl>
              </FormGroup>
            </Col>

            <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
              <FormGroup controlId="formControlsSectionSelect">
                <ControlLabel>Select a Section</ControlLabel>
                <FormControl componentClass="select" placeholder="select">
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
                    DeskArr.map((value) => {
                      return (
                        <Radio
                          key={value}
                          name="resources"
                          id={value}
                          value={value}
                          checked={this.state.selectedResource === value}
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
              <ConfirmRequestModal {...this.state} handleSubmit={this.submitClick} />
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Request);
