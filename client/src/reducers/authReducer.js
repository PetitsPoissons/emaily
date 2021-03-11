import { FETCH_USER } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false; // return false if the payload is an empty string (which is considered a falsy value)
    default:
      return state;
  }
}
