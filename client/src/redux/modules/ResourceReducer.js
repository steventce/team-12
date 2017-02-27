import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_AVAILABLE_RESOURCES = 'GET_AVAILABLE_RESOURCES';

// Action Creators

export const getAvailableResources = createAction(
  GET_AVAILABLE_RESOURCES,
  service.getResources
);

// Reducer

const initialState = {
  availableResources: []
};

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    return state;
  }

  switch(action.type) {
    case GET_AVAILABLE_RESOURCES: {
      return { ...state, availableResources: action.payload }
    }
    default:
      return state;
  }
}
