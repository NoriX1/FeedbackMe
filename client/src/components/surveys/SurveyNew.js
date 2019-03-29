import React from 'react';
import SurveyForm from './SurveyForm';
class SurveyNew extends React.Component {
    render() {
        return (
            <div>
                <h5>Creating New Survey</h5>
                <SurveyForm />
            </div>
        );
    }
}

export default SurveyNew;