import React from 'react';
import SurveyForm from './SurveyForm';
class SurveyNew extends React.Component {
    render() {
        return (
            <div>
                <h3>Creating New Survey</h3>
                <SurveyForm />
            </div>
        );
    }
}

export default SurveyNew;