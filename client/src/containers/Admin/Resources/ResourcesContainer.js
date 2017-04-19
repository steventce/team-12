import { connect } from 'react-redux';
import {
  getAllResources,
  addResource,
  editResource,
  deleteResource,
  resetStatus,
  setStatus
} from '../../../redux/modules/ResourceReducer';
import { getLocations } from '../../../redux/modules/LocationReducer';
import { ResourcesTable } from '../../../components';

const STATUS_TYPE = {
  LOADING: 'loading'
}

const mapDispatchToProps = function(dispatch) {
  return {
    getLocations: () => {
      return dispatch(getLocations());
    },
    getResources: (locationId) => {
      return dispatch(getAllResources(locationId));
    },
    addResource: (locationId, resource) => {
      dispatch(setStatus(STATUS_TYPE.LOADING));
      dispatch(addResource(locationId, resource));
    },
    editResource: (resourceId, resource) => {
      dispatch(setStatus(STATUS_TYPE.LOADING));
      dispatch(editResource(resourceId, resource));
    },
    deleteResource: (resourceId) => {
      dispatch(setStatus(STATUS_TYPE.LOADING));
      dispatch(deleteResource(resourceId));
    },
    resetStatus: () => {
      dispatch(resetStatus());
    }
  }
}

const mapStateToProps = function(state) {
  const { adminReducer, resources, locations } = state;
  return { ...resources, locations: locations.locations, admin: adminReducer.admin };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesTable);
