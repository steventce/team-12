import { connect } from 'react-redux';
import {
  getAllResources,
  addResource,
  editResource,
  deleteResource,
  resetStatus,
  setStatus
} from '../../../redux/modules/ResourceReducer';
import { ResourcesTable } from '../../../components';

const STATUS_TYPE = {
  LOADING: 'loading'
}

const mapDispatchToProps = function(dispatch) {
  return {
    getResources: (locationId) => {
      dispatch(getAllResources(locationId));
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
  return state.resources;
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesTable);
