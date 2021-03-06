import React from 'react';
import { connect } from 'react-redux';
import { fetchSurveysRequest, deleteSurveyRequest } from '../../actions';

class SurveyList extends React.Component {
  componentDidMount() {
    this.props.fetchSurveysRequest();
  }

  renderSurveys = () => {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card darken-1" key={survey._id}>
          <div className="card-content">
            <span className="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            <p style={{ fontStyle: 'italic' }}>{survey.description || ''}</p>
            <p className="right">Sent On: {new Date(survey.dateSent).toLocaleDateString()}</p>
            <br />
            <p className="right">
              <span>Last Responded: </span>
              <span>{survey.lastResponded ?
                new Date(survey.lastResponded).toLocaleString() :
                'No Responses'}</span>
            </p>
          </div>
          <div className="card-action">
            <span style={{ marginRight: '20px', color: 'green' }}>Yes: {survey.yes}</span>
            <span style={{ color: 'red' }}>No: {survey.no}</span>
            <button
              className="red right btn-flat white-text"
              style={{ marginTop: '-5px' }}
              onClick={() => { this.props.deleteSurveyRequest(survey._id) }}
            >Delete</button>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderSurveys()}</div>;
  }
}

function mapStateToProps(state) {
  return { surveys: Object.values(state.surveys) };
}

export default connect(mapStateToProps, { fetchSurveysRequest, deleteSurveyRequest })(SurveyList);