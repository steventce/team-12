import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_ADMIN = 'GET_ADMIN';

export const getAdmin = createAction(GET_ADMIN, service.getAdmin);

const initialState = {
  admin: ''
}

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    return state;
  }

  switch(action.type) {
    case GET_ADMIN: {
      return { ...state, admin: getObjValues(action.payload)};
    }
    default:{
      return state;
    }
  }
}

function getObjValues(obj) {
    let values = [];

    for (var prop in obj) {
      if (obj[prop] !== undefined )
        values.push(obj[prop])
    }
    return values;
}