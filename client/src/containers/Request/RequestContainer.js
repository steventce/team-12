import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { getAvailableResources } from '../../redux/modules/ResourceReducer';
import { getReservations, makeReservation } from '../../redux/modules/ReservationReducer';
import Request from './Request';
import floor1 from '../../images/1_floor.png';
import floor2 from '../../images/2_floor.png';
import floor3 from '../../images/3_floor.png';
import floor4 from '../../images/4_floor.png';

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
      floorMapImgSrc: floor1,
      sections: ['A', 'B'],
      status: null,
      employeeId: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status) {
      this.setState({ status: nextProps.status});
    }
    if (nextProps.employeeId) {
      this.setState({ employeeId: nextProps.employeeId });
    }
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
      selectedResourceName: resource.Desk.desk_number,
    });
  }

  onChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
      selectedResourceId: -1,
      selectedResourceName: '',
    });

    this.props.dispatch(getAvailableResources(1, {
      ...this.state, [name]: value
    }));
  }

  onEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  onFloorChange(event, floorMapImg) {
    let newFloor = event.target.value;
    this.setState({
      floor: newFloor
    });

    // TODO: need to refactor this to not use switch statement
    switch(newFloor) {
      case "1": {
        this.setState({ floorMapImgSrc: floor1 });
      break;
      }
      case "2": {
        this.setState({ floorMapImgSrc: floor2 });
      break;
      }
      case "3": {
        this.setState({ floorMapImgSrc: floor3 });
      break;
      }
      case "4": {
        this.setState({ floorMapImgSrc: floor4 });
      break;
      }
      default: {
        this.setState({ floorMapImgSrc: floor1 });
      break;
      }
    }
    this.props.dispatch(getAvailableResources(1, {
      ...this.state, floor: newFloor
    }));
  }

  submitClick() {
    this.props.dispatch(makeReservation({
      ...this.state,
      resourceId: this.state.selectedResourceId,
      staffEmail: this.state.email
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
        onEmailChange={this.onEmailChange.bind(this)}
        onFloorChange={this.onFloorChange.bind(this)}
        submitClick={this.submitClick.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { db, resources } = state;
  return {
    availableResources: resources.availableResources,
    status: db.status,
    employeeId: db.employeeId,
  };
}

export default connect(mapStateToProps)(RequestContainer);
