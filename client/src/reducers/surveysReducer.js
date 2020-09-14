import _ from 'lodash';
import { Types } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case Types.FETCH_SURVEYS:
      return { ...state, ..._.mapKeys(action.payload, '_id') };
    case Types.DELETE_SURVEY:
      return _.omit(state, action.payload);
    default:
      return state;
  }
}
