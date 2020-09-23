export const Types = {
  FETCH_USER_REQUEST: 'fetch_user_request',
  FETCH_USER_SUCCESS: 'fetch_user_success',
  HANDLE_TOKEN_REQUEST: 'handle_token_request',
  FETCH_SURVEYS_REQUEST: 'fetch_surveys_request',
  FETCH_SURVEYS_SUCCESS: 'fetch_surveys_success',
  SUBMIT_SURVEY_REQUEST: 'submit_survey_request',
  DELETE_SURVEY_REQUEST: 'delete_survey_request',
  DELETE_SURVEY_SUCCESS: 'delete_survey_success'
};

export const fetchUserRequest = () => {
  return { type: Types.FETCH_USER_REQUEST };
};

export const fetchUserSuccess = user => {
  return { type: Types.FETCH_USER_SUCCESS, payload: user };
};

export const handleTokenRequest = token => {
  return { type: Types.HANDLE_TOKEN_REQUEST, payload: token };
};

export const fetchSurveysRequest = () => {
  return { type: Types.FETCH_USER_REQUEST };
};

export const fetchSurveysSuccess = surveys => {
  return { type: Types.FETCH_SURVEYS_SUCCESS, payload: surveys };
};

export const submitSurveyRequest = values => {
  return { type: Types.SUBMIT_SURVEY_REQUEST, payload: values };
};

export const deleteSurveyRequest = id => {
  return { type: Types.DELETE_SURVEY_REQUEST, payload: id };
};

export const deleteSurveySuccess = id => {
  return { type: Types.DELETE_SURVEY_SUCCESS, payload: id };
};
