import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './Header';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';
import Landing from './Landing';
import { fetchUser } from '../actions';
import history from '../history';
import PaymentSuccess from './payments/PaymentSuccess';
import PaymentFail from './payments/PaymentFail';

class App extends React.Component {

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <Router history={history}>
                <div className="container">
                    <Header />
                    <Route exact path="/" component={Landing}></Route>
                    <Route exact path="/surveys" component={Dashboard}></Route>
                    <Route path="/surveys/new" component={SurveyNew}></Route>
                    <Route path="/yandex/success" component={PaymentSuccess}></Route>
                    <Route path="/yandex/fail" component={PaymentFail}></Route>
                </div>
            </Router>
        );
    }
}

export default connect(null, { fetchUser })(App);