import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { submitSurvey } from '../../actions';

const SurveyFormReview = (props) => {

  const reviewFields = formFields.map(({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{props.formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm you entries</h5>
      <div>
        {reviewFields}
      </div>
      <button
        className="yellow darken-4 white-text btn-flat"
        onClick={props.onCancel}
      >Back</button>
      <button className="green btn-flat right" onClick={() => props.submitSurvey(props.formValues)}>
        <span className="white-text">Send Survey</span>
        <i className="material-icons white-text right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    formValues: state.form.surveyForm.values
  };
}

export default connect(mapStateToProps, { submitSurvey })(SurveyFormReview);