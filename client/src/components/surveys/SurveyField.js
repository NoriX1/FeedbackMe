import React from 'react';

const SurveyField = ({ input, label, meta, placeholder, autoComplete }) => {

  const inputStyle = () => {
    if (meta.touched && meta.error) {
      return { marginBottom: '5px', borderBottom: '1px solid red' };
    }
    return { marginBottom: '5px' };
  }

  return (
    <div>
      <label>{label}</label>
      <input {...input} style={inputStyle()} placeholder={placeholder} autoComplete={autoComplete} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {meta.touched && meta.error}
      </div>
    </div>
  );
}

export default SurveyField;