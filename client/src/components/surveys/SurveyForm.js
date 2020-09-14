import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends React.Component {

  onFormSubmit(formValues) {
    formValues.recipients = formValues.recipients
      .split(',')
      .map(recipient => recipient.trim()).filter(recipient => recipient).join(', ');
    this.props.onSurveySubmit();
  }

  renderFields() {
    return formFields.map(({ label, name, placeholder = '' }) => {
      return (
        <Field
          label={label}
          name={name}
          component={SurveyField}
          key={name}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
        />
      );
    });
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(formValues => this.onFormSubmit(formValues))}>
        {this.renderFields()}
        <button type="submit" className="teal btn-flat right white-text">
          <span>Next</span>
          <i className="material-icons right">done</i>
        </button>
        <Link to="/surveys" className="red btn-flat white-text">Cancel</Link>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};
  errors.recipients = validateEmails(values.recipients);
  formFields.forEach(field => {
    if (!values[field.name]) {
      errors[field.name] = `You must provide a ${field.name}`;
    }
  });

  return errors;
}

export default reduxForm({
  form: 'surveyForm',
  validate,
  destroyOnUnmount: false
})(SurveyForm);