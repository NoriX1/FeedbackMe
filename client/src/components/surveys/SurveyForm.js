import _ from 'lodash';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';

import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import FIELDS from './formFields';

class SurveyForm extends React.Component {

    renderFields() {
        return _.map(FIELDS, ({ label, name }) => {
            return <Field key={name} component={SurveyField} type="text" label={label} name={name} />
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">Cancel</Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        <span>Next</span>
                        <i className="material-icons right">done</i>
                    </button>
                </form>
            </div>

        );
    }
}

function validate(values) {
    const errors = {};

    errors.recipients = validateEmails(values.recipients || '');
    _.each(FIELDS, ({ name }) => {
        if (!values[name]) {
            errors[name] = `You must provide a ${name}`;
        }
    });
    return errors;
}

export default reduxForm({
    form: 'surveyForm',
    validate,
    destroyOnUnmount: false
})(SurveyForm);