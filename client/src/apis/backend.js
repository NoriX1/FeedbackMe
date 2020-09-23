import axios from 'axios';

export const fetchUser = () => {
  return axios.get('/api/current_user');
};

export const handleToken = token => {
  return axios.post('/api/stripe', token);
};

export const submitSurvey = values => {
  return axios.post('/api/surveys', values);
};

export const fetchSurveys = () => {
  return axios.get('/api/surveys');
}

export const deleteSurvey = id => {
  return axios.delete(`/api/surveys/${id}`);
}