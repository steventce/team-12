import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { makeReservation } from '../../redux/modules/ReservationReducer';
import Request from './Request';

class RequestContainer extends Component {
  constructor(props) {
    super(props);
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
  }

  onStartDateChange(startDateTime) {
    this.setState({ startDateTime });
  }

  onEndDateChange(endDateTime) {
    this.setState({ endDateTime });
  }

  onResourceSelect(event) {
    const { value } = event.currentTarget;
    this.setState({
      selectedResource: value,
      selectedResourceName: this.props.resources[this.state.floorNum-1][Number(value)]
    });
  }

  onFloorNumChange(event) {
    this.setState({
      floorNum: event.target.value,
      selectedResource: '-1'
    });
  }

  submitClick() {
     this.props.dispatch(makeReservation({
      ...this.state,
      resourceId: this.state.selectedResourceName
    }, this.props.employeeId));
  }

  render() {
    return (
      <Request
        {...this.state}
        resources={this.props.resources}
        onStartDateChange={this.onStartDateChange.bind(this)}
        onEndDateChange={this.onEndDateChange.bind(this)}
        onResourceSelect={this.onResourceSelect.bind(this)}
        onFloorNumChange={this.onFloorNumChange.bind(this)}
        submitClick={this.submitClick.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps)(RequestContainer);
