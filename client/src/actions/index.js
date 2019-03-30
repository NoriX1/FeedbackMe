import axios from 'axios';
import history from '../history';
import { FETCH_USER } from './types';
import { FETCH_SURVEYS } from './types';
import { DELETE_SURVEY } from './types';

export const fetchUser = () => {
    return async (dispatch) => {
        const res = await axios.get('/api/current_user');
        dispatch({ type: FETCH_USER, payload: res.data })
    }
};

export const handleToken = (token) => {
    return async (dispatch) => {
        const res = await axios.post('/api/stripe', token);
        dispatch({ type: FETCH_USER, payload: res.data })
    }
};

export const submitSurvey = (values) => async dispatch => {
    const res = await axios.post('/api/surveys', values);
    history.push('/surveys');
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
    const res = await axios.get('/api/surveys');

    dispatch({ type: FETCH_SURVEYS, payload: res.data });
}

export const deleteSurvey = (id) => async dispatch => {
    await axios.delete('/api/surveys/', { data: { surveyId: id } });

    dispatch({ type: DELETE_SURVEY, payload: id })
}