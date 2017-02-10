const SELECT_RESOURCE = 'SELECT_RESOURCE';

// Action Creators
export function selectResource(resource) {
  return {
    type: SELECT_RESOURCE,
    resource
  }
}

// Reducer
const initialState = {
  resourceSelected: {}
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SELECT_RESOURCE:
      return { ...state, resourceSelected: action.resource };
    default:
      return state;
  }
}
