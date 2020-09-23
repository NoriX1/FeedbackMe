import { all } from 'redux-saga/effects';
import surveysSaga from './surveys';
import usersSaga from './users';

export default function* rootSaga() {
  yield all([...usersSaga, ...surveysSaga]);
}