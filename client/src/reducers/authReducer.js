import { Types } from '../actions';

export default (state = null, action) => {
  switch (action.type) {
    case Types.FETCH_USER:
      return action.payload || false;
    default:
      return state;
  }
}