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
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css';
import { DATE_TIME_FORMAT } from '../../utils/formatter';
import ConfirmRequestModal from '../../components/ConfirmRequestModal';
import AlertMessage from '../../components/AlertMessage';
import ReactDOM from 'react-dom';
import ReactImageZoom from 'react-image-zoom';

momentLocalizer(moment);

class Request extends Component {
  render() {
    const {
      floor,
      floors,
      floorMapImgSrc,
      sections,
      selectedResourceId,
      selectedResourceName,
      resourceTypes,
      startDate,
      endDate,
      status,
    } = this.props;

    const imgProps = {width: 750, height: 618, zoomWidth: 200, img: floorMapImgSrc, offset: {vertical: 0, horizontal: 5}};

    return (
      <div>
        <AlertMessage alertVisible={ status }/>
        <Grid>
          <Row>
            <h1 className="text-center">Request a Resource</h1>
          </Row>

          <Form>
            <Row className="show-grid">
            {/* Column for selecting options/entering inputs */}
            <Col xs={6} md={12} >

              {/* Column for selecting a resource type, floor, and section */}
              <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>

                {/* Select a resource type */}
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

                {/* Select a floor */}
                <FormGroup controlId="formControlsFloorSelect">
                  <ControlLabel>Select a Floor</ControlLabel>
                  <FormControl componentClass="select" onChange={this.props.onFloorChange.bind(this)} name="floor">
                    {floors.map(function (floor) {
                      return (
                        <option key={floor} value={floor}>Floor {floor}</option>
                      );
                    })}
                  </FormControl>
                </FormGroup>

                {/* Select a section */}
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


              {/* Column for start date, end date, and email */}
              <Col xs={12} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>

                {/* Select a start date */}
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

                {/* Select an end date */}
                <FormGroup controlId="formControlsSectionSelect">
                  <ControlLabel>To</ControlLabel>
                  <DateTimePicker
                    value={endDate}
                    format={DATE_TIME_FORMAT}
                    onChange={this.props.onEndDateChange}
                    min={moment(startDate).add(1, 'h').toDate()}
                    max={moment().add(1, 'y').startOf('day').toDate()}
                    step={60}
                  />
                </FormGroup>

                {/* Enter email for confirmation  */}
                <ControlLabel>Email (Optional)</ControlLabel>
                <FormControl type="email" label="Email (Optional)" placeholder="Email" onChange={this.props.onEmailChange.bind(this)}>
                </FormControl>

              </Col>

              {/* Column map image and zoomed in image */}
              <Col xs={12} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>

                <div style={{ border: "thin solid black" }}>
                  <div style={{ paddingLeft: "10px", paddingTop: "10px" }}><b>Available Resources</b></div>
                  {/* TODO: dynamically allocate size */}
                  <div style={{ height: "180px", overflowY: "auto", paddingLeft: "10px" }}>
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

            </Col>

            {/* ImageMap and specific resource */}
            <Row className="show-grid">
              <Col xs={12} md={8} style={{ height: "650px" }} >
                <ReactImageZoom {...imgProps} />
              </Col>
            </Row>

            {/* Submit button */}
            <Row className="show-grid" style={{ marginTop: '20px' }}>
              <Col xs={2} md={2}>
                <ConfirmRequestModal {...this.props} handleSubmit={this.props.submitClick} />
              </Col>
            </Row>

            </Row>
          </Form>

        </Grid>
      </div>
    );
  }
}

export default Request;
