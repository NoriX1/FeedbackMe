import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends React.Component {
    render() {
        return (
            <React.Fragment>
                <StripeCheckout
                    name="Feedback Me"
                    description="$5 for 5 email credits"
                    amount={500}
                    token={token => this.props.handleToken(token)}
                    stripeKey={process.env.REACT_APP_STRIPE_KEY}
                >
                    <button className="btn" style={{ backgroundColor: "#82cbff" }}>Pay with Stripe</button>
                </StripeCheckout>
                <a href="/api/yandex" className="btn" style={{ backgroundColor: "#82cbff", marginBottom: "-1px" }}>Pay with Yandex</a>
            </React.Fragment>
        );
    }
}

export default connect(null, actions)(Payments);