import axios from 'axios';
import history from '../history';

export const Types = {
  FETCH_USER: 'fetch_user',
  FETCH_SURVEYS: 'fetch_surveys',
  DELETE_SURVEY: 'delete_survey'
}

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: Types.FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: Types.FETCH_USER, payload: res.data });
};

export const submitSurvey = values => async dispatch => {
  const res = await axios.post('/api/surveys', values);
  history.push('/surveys');
  dispatch({ type: Types.FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: Types.FETCH_SURVEYS, payload: res.data });
}

export const deleteSurvey = id => async dispatch => {
  await axios.delete(`/api/surveys/${id}`);

  dispatch({ type: Types.DELETE_SURVEY, payload: id });
}