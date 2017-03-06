import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { getAvailableResources } from '../../redux/modules/ResourceReducer';
import { getReservations, makeReservation } from '../../redux/modules/ReservationReducer';
import Request from './Request';

class RequestContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypes: ['Desk'],
      resourceType: 'Desk',
      floor: 1,
      section: '',
      selectedResourceId: -1,
      selectedResourceName: '',
      email: '',
      startDate: moment().startOf('hour').toDate(),
      endDate: moment().add(1, 'h').startOf('hour').toDate(),
      floors: [1, 2, 3, 4],
      sections: ['A', 'B']
    };
  }

  componentDidMount() {
    const {
      resourceType,
      startDate,
      endDate,
      floor,
      section
    } = this.state;

    this.props.dispatch(getAvailableResources(1, {
      resourceType, startDate, endDate, floor, section
    }));
  }

  onStartDateChange(startDate) {
    this.setState({ startDate });
    if (moment(startDate).isSameOrAfter(moment(this.state.endDate))) {
      let newEndDate = moment(startDate).add(1, 'h').startOf('hour').toDate();
      this.setState({ endDate: newEndDate });
    }
    this.setState({ selectedResourceId: -1 });

    const {
      resourceType,
      endDate,
      floor,
      section
    } = this.state;

    this.props.dispatch(getAvailableResources(1, {
      resourceType, startDate, endDate, floor, section
    }));
  }

  onEndDateChange(endDate) {
    this.setState({ endDate });
    this.setState({ selectedResourceId: -1 });

    const {
      resourceType,
      startDate,
      floor,
      section
    } = this.state;

    this.props.dispatch(getAvailableResources(1, {
      resourceType, startDate, endDate, floor, section
    }));
  }

  onResourceSelect(resource, event) {
    const { resource_id } = resource;

    this.setState({
      selectedResourceId: resource_id,
      selectedResourceName: resource.Desk.desk_number
    });
  }

  onChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
      selectedResourceId: -1,
      selectedResourceName: ''
    });

    this.props.dispatch(getAvailableResources(1, {
      ...this.state, [name]: value
    }));
  }

  submitClick() {
    this.props.dispatch(makeReservation({
      ...this.state,
      resourceId: this.state.selectedResourceId
    }, this.props.employeeId));
  }

  render() {
    return (
      <Request
        {...this.state}
        availableResources={this.props.availableResources}
        onStartDateChange={this.onStartDateChange.bind(this)}
        onEndDateChange={this.onEndDateChange.bind(this)}
        onResourceSelect={this.onResourceSelect.bind(this)}
        onChange={this.onChange.bind(this)}
        submitClick={this.submitClick.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { resources } = state;
  return {
    availableResources: resources.availableResources
  };
}

export default connect(mapStateToProps)(RequestContainer);
