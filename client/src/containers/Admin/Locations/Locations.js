import {
  getLocations,
  addLocation,
  editLocation,
  deleteLocation,
  resetStatus,
  setStatus
} from '../../../redux/modules/LocationReducer';
import { connect } from 'react-redux';
import { LocationsTable } from '../../../components';

const STATUS_TYPE = {
  LOADING: 'loading'
}

const mapDispatchToProps = function(dispatch) {
  return {
    getLocations: () => {
      dispatch(getLocations());
    },
    addLocation: (location) => {
      dispatch(setStatus(STATUS_TYPE.LOADING));
      dispatch(addLocation(location))
    },
    editLocation: (locationId, location) => {
      dispatch(setStatus(STATUS_TYPE.LOADING));
      dispatch(editLocation(locationId, location));
    },
    deleteLocation: (locationId) => {
      dispatch(setStatus(STATUS_TYPE.LOADING));
      dispatch(deleteLocation(locationId));
    },
    resetStatus: () => {
      dispatch(resetStatus());
    }
  }
}

const mapStateToProps = (state) => {
  const { adminReducer, locations } = state;
  return { ...locations, admin: adminReducer.admin };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationsTable);
