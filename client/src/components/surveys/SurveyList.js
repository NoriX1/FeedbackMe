import React from 'react';
import { connect } from 'react-redux';
import { fetchSurveys, deleteSurvey } from '../../actions';

class SurveyList extends React.Component {

    componentDidMount() {
        this.props.fetchSurveys();
    }

    renderSurveys() {
        return this.props.surveys.reverse().map(survey => {
            return (
                <div className="card darken-1" key={survey._id}>
                    <div className="card-content">
                        <span className="card-title">{survey.title}</span>
                        <p>{survey.body}</p>
                        <p className="right">Sent On: {new Date(survey.dateSent).toLocaleDateString()}</p>
                        <br />
                        <p className="right">Last Responded: 
                            {survey.lastResponded ? new Date(survey.lastResponded).toLocaleDateString() : 'No Responses'}
                        </p>
                    </div>
                    <div className="card-action">
                        <span style={{ marginRight: '20px', color: 'green' }}>Yes: {survey.yes}</span>
                        <span style={{ color: 'red' }}>No: {survey.no}</span>
                        <button
                            className="red right btn-flat white-text"
                            style={{ marginTop: '-5px' }}
                            onClick={() => { this.props.deleteSurvey(survey._id) }}
                        >Delete</button>
                    </div>
                </div>
            );
        })
    }

    render() {
        return (
            <div>{this.renderSurveys()}</div>
        );
    }
}

function mapStateToProps({ surveys }) {
    return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys, deleteSurvey })(SurveyList);