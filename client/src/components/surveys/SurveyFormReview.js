import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FIELDS from './formFields';
import * as actions from '../../actions';

const SurveyFormReview = (props) => {
    const reviewFields = _.map(FIELDS, field => {
        return (
            <div key={field.name}>
                <label>{field.label}</label>
                <div>{props.formValues[field.name]}</div>
            </div>
        );
    });
    return (
        <div>
            <h5>Please, confirm your entries</h5>
            {reviewFields}
            <button className="yellow darken-3 white-text btn-flat" onClick={props.onCancel}>Back</button>
            <button className="green btn-flat right white-text" onClick={() => props.submitSurvey(props.formValues, props.history)}>
                <span>Send Survey</span>
                <i className="material-icons right">email</i>
            </button>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));