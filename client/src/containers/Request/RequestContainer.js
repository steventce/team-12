import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { getAvailableResources } from '../../redux/modules/ResourceReducer';
import { getLocations } from '../../redux/modules/LocationReducer';
import { resetStatus, makeReservation, confirmReservation, abortReservation } from '../../redux/modules/ReservationReducer';
import Request from './Request';
import floor1 from '../../images/floor_1.png';
import floor2 from '../../images/floor_2.png';
import floor3 from '../../images/floor_3.png';
import floor4 from '../../images/floor_4.png';

/*global staffDetails_empid:true, staffDetails_name:true, staffDetails_dept:true*/

class RequestContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location_id: -1,
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
      employeeId: staffDetails_empid,
      employeeName: staffDetails_name,
      employeeDept: staffDetails_dept,
      status: null,
      errorMsg: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status) {
      this.setState({ status: nextProps.status});
    }
    if (nextProps.errorMsg) {
      this.setState({ errorMsg: nextProps.errorMsg });
    }

    if (nextProps.locations !== this.props.locations) {
      if (nextProps.locations && nextProps.locations.length > 0) {
        this.setState({location_id: nextProps.locations[0].location_id})
        this.refreshResourceList(nextProps.locations[0].location_id)
      }
      else {
        this.setState({location_id: -1})
        this.refreshResourceList(-1)
      }
    }
  }

  componentDidMount() {
    this.props.dispatch(getLocations())
  }

  componentWillUnmount() {
    // reset status in store
    this.props.dispatch(resetStatus());
  }

  onStartDateChange(startDate) {
    let endDate = this.state.endDate
      
    this.setState({
      startDate,
      selectedResourceId: -1
    });

    if (moment(startDate).isSameOrAfter(moment(endDate))) {
      const newEndDate = moment(startDate).add(1, 'h').startOf('hour').toDate();
      this.setState({ endDate: newEndDate });
      endDate = newEndDate;
    }

    this.refreshResourceList(this.state.location_id, {startDate, endDate})
  }

  onEndDateChange(endDate) {
    this.setState({ endDate });
    this.setState({ selectedResourceId: -1 });

    this.refreshResourceList(this.state.location_id, {endDate})
  }

  onResourceSelect(resource, event) {
    const { resource_id } = resource;

    this.setState({
      selectedResourceId: resource_id,
      selectedResourceName: resource.Desk.desk_number,
    });
  }

  refreshResourceList(location_id, reqOverride) {
    const {
      resourceType,
      startDate,
      endDate,
      floor,
      section,
    } = this.state;

    const req = Object.assign({
      resourceType,
      startDate,
      endDate,
      floor,
      section
    }, reqOverride)

    this.props.dispatch(getAvailableResources(location_id, req))
  }

  onLocationChange(event) {
    const location_id = event.target.value;
    this.setState({location_id});
    this.setState({ selectedResourceId: -1 });

    this.refreshResourceList(location_id)
  }

  onChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
      selectedResourceId: -1,
      selectedResourceName: '',
    });

    this.refreshResourceList(this.state.location_id, {[name]: value})
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

    this.refreshResourceList(this.state.location_id, {floor: newFloor})
  }

  submitClick() {
    this.props.dispatch(makeReservation({
      ...this.state,
      resourceId: this.state.selectedResourceId,
      staffName: this.state.employeeName,
      staffDepartment: this.state.employeeDept,
      staffEmail: this.state.email
    }, this.state.employeeId));
  }

  confirmClick() {
    this.props.dispatch(confirmReservation(this.props.pendingTransactionId, staffDetails_empid));
  }

  abortClick() {
    this.props.dispatch(abortReservation(this.props.pendingTransactionId, staffDetails_empid));
  }

  render() {
    return (
      <Request
        {...this.state}
        locations={this.props.locations}
        availableResources={this.props.availableResources}
        onLocationChange={this.onLocationChange.bind(this)}
        onStartDateChange={this.onStartDateChange.bind(this)}
        onEndDateChange={this.onEndDateChange.bind(this)}
        onResourceSelect={this.onResourceSelect.bind(this)}
        onChange={this.onChange.bind(this)}
        onEmailChange={this.onEmailChange.bind(this)}
        onFloorChange={this.onFloorChange.bind(this)}
        submitClick={this.submitClick.bind(this)}
        confirmClick={this.confirmClick.bind(this)}
        abortClick={this.abortClick.bind(this)}
        router={this.props.router}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { db, resources, locations } = state;
  return {
    availableResources: resources.availableResources,
    locations: locations.locations,
    status: db.status,
    errorMsg: db.errorMsg,
    pendingTransactionId: db.pendingTransactionId
  };
}

export default connect(mapStateToProps)(RequestContainer);
