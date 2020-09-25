import { takeEvery, fork, call, put, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as api from '../apis/backend';

function* fetchUser() {
  try {
    const res = yield call(api.fetchUser);
    yield put(actions.fetchUserSuccess(res.data));
  } catch (err) {
    console.log(err);
  }
}

function* handleToken(token) {
  try {
    const res = yield call(api.handleToken, token);
    yield put(actions.fetchUserSuccess(res.data));
  } catch (err) {
    console.log(err);
  }
}

function* watchFetchUserRequest() {
  yield takeEvery(actions.Types.FETCH_USER_REQUEST, fetchUser);
}

function* watchHandleTokenRequest() {
  while (true) {
    const action = yield take(actions.Types.HANDLE_TOKEN_REQUEST);
    yield call(handleToken, action.payload);
  }
}

const usersSagas = [
  fork(watchFetchUserRequest),
  fork(watchHandleTokenRequest)
];

export default usersSagas;