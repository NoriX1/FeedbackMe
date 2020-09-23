import { takeLatest, call, put, fork, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as api from '../apis/backend';
import history from '../history';

function* fetchSurveys() {
  try {
    const res = yield call(api.fetchSurveys);
    yield put(actions.fetchSurveysSuccess(res.data));
  } catch (err) {
    console.log(err);
  }
}

function* submitSurvey(formValues) {
  try {
    const res = yield call(api.submitSurvey, formValues);
    yield put(actions.fetchUserSuccess(res.data));
    history.push('/surveys');
  } catch (err) {
    console.log(err);
  }
}

function* deleteSurvey(action) {
  try {
    yield call(api.deleteSurvey, action.payload);
    yield put(actions.deleteSurveySuccess(action.payload));
  }
  catch (err) {
    console.log(err);
  }
}

function* watchFetchSurveys() {
  yield takeLatest(actions.Types.FETCH_USER_REQUEST, fetchSurveys);
}

function* watchSubmitSurvey() {
  while (true) {
    const action = yield take(actions.Types.SUBMIT_SURVEY_REQUEST);
    yield call(submitSurvey, action.payload);
  }
}

function* watchDeleteSurvey() {
  yield takeLatest(actions.Types.DELETE_SURVEY_REQUEST, deleteSurvey);
}

const surveysSaga = [
  fork(watchFetchSurveys),
  fork(watchSubmitSurvey),
  fork(watchDeleteSurvey)
];

export default surveysSaga;