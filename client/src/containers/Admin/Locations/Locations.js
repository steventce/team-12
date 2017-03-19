import { getLocations, addLocation, editLocation, deleteLocation } from '../../../redux/modules/LocationReducer';
import { connect } from 'react-redux';
import { LocationsTable } from '../../../components';

const mapDispatchToProps = function(dispatch) {
  return {
    getLocations: () => {
      dispatch(getLocations());
    },
    addLocation: (location) => {
      dispatch(addLocation(location, () => {
        dispatch(getLocations())
      }));
    },
    editLocation: (locationId, location) => {
      dispatch(editLocation(locationId, location, () => {
        dispatch(getLocations())
      }));
    },
    deleteLocation: (locationId) => {
      dispatch(deleteLocation(locationId, () => {
        dispatch(getLocations())
      }));
    }
  }
}

const mapStateToProps = (state) => {
  return state.locations;
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationsTable);
