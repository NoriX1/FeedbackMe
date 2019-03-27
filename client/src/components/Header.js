import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Payments from './Payments';

class Header extends React.Component {

    renderContent() {
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return (
                    <li>
                        <a href="/auth/google">Login With Google</a>
                    </li>
                );
            default:
                return (
                    <React.Fragment>
                        <li>
                            <Payments />
                        </li>
                        <li style={{margin: '0px 10px'}}>Credits: {this.props.auth.credits}</li>
                        <li>
                            <a href="/api/logout">Logout</a>
                        </li>
                    </React.Fragment>
                );
        }
    }

    render() {
        return (
            <nav style={{ backgroundColor: '#6eb9ee' }}>
                <div className="nav-wrapper">
                    <Link to={this.props.auth ? '/surveys' : '/'} className="left brand-logo">FeedbackMe</Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
}

export default connect(mapStateToProps)(Header);