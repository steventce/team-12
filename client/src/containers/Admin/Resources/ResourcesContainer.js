import { connect } from 'react-redux';
import {
  getAllResources,
  addResource,
  editResource,
  deleteResource
} from '../../../redux/modules/ResourceReducer';
import { ResourcesTable } from '../../../components';

const mapDispatchToProps = function(dispatch) {
  return {
    getResources: (locationId) => {
      dispatch(getAllResources(locationId));
    },
    addResource: (locationId, resource) => {
      dispatch(addResource(locationId, resource));
    },
    editResource: (resourceId, resource) => {
      dispatch(editResource(resourceId, resource));
    },
    deleteResource: (resourceId) => {
      dispatch(deleteResource(resourceId));
    }
  }
}

const mapStateToProps = function(state) {
  return state.resources;
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesTable);
