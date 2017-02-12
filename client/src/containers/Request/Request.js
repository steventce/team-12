import React, { Component } from 'react';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Row } from 'react-bootstrap';
import StaticMapImg from '../../images/Capture.PNG';
import { connect } from 'react-redux';
import { selectResource } from '../../redux/modules/Request';

// TODO: remove these and use props
const FloorNumArr = [1, 2, 3, 4, 5];
const SectionArr = ["A", "B", "C", "D", "E"];
const DeskArr = ["1.A.101", "1.A.102", "1.A.103", "1.A.104", "1.A.105", "1.A.106", "1.A.107", "1.A.108", "1.A.109", "1.A.110"]

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      floorNum: '',
      section: '',
      selectedResource: '',
      email: '',
    };

    this.testFunc = this.submitClick.bind(this);
  }

  submitClick() {
    // TODO
  }

  handleClick() {
    this.props.dispatch(selectResource({ id: 1 }));
  }

  render() {
    return (
      <div>
        <h1>Request a Resource</h1>
        {/* Select floor and section */}
        <div>
          <Grid>
            <Row className="show-grid">
              <Col xs={6} md={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
                <FormGroup controlId="formControlsFloorSelect">
                  <ControlLabel>Select a Floor</ControlLabel>
                  <FormControl componentClass="select">
                    {FloorNumArr.map(function (value) {
                      return (
                        <option value="other">{value}</option>
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
                        <option value="other">{value}</option>
                      );
                    })}
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
          </Grid>

          {/* ImageMap and specific resource */}
          <div>
            <Grid>
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
                        DeskArr.map(function (value) {
                          return (
                            <div>
                              <label>
                                <input type="radio" name="optionsRadios" id={value} value={value} />
                                {value}
                              </label>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>

        </div>

        {/* Reservation time */}
        <div style={{ padding: "10px" }}>
          <Grid>
            <Row>
              <Col xs={6} md={4}>
                <b>Reserve for</b>
              </Col>
            </Row>
          </Grid>
        </div>

        {/* Email option */}
        <div style={{ padding: "10px" }}>
          <Grid>
            <Row className="show-grid">
              <Col xs={2} md={2}>Email (Optional)</Col>
              <Col xs={1} md={1}>
                <input type="text" />
              </Col>
            </Row>
          </Grid>
        </div>

        {/* Submit button */}
        <div style={{ paddingBottom: "10px" }}>
          <Grid>
            <Row className="show-grid">
              <Col xs={2} md={2}>
                <Button bsStyle="primary" onClick={this.submitClick}>Submit</Button>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Request);
