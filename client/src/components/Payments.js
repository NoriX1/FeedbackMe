import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { handleTokenRequest } from '../actions';

class Payments extends React.Component {
  paymentAmount = 500;

  render() {
    return (
      <React.Fragment>
        <StripeCheckout
          name="Feedback Me"
          description="$5 for 5 email credits"
          amount={this.paymentAmount}
          token={token => this.props.handleTokenRequest({ ...token, amount: this.paymentAmount })}
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
        >
          <button className="btn" style={{ backgroundColor: "#82cbff" }}>Pay with Stripe</button>
        </StripeCheckout>
        <a
          href="/api/yandex"
          className="btn"
          style={{ backgroundColor: "#82cbff", marginBottom: "-1px" }}
        >Pay with Yandex</a>
      </React.Fragment>
    );
  }
}

export default connect(null, { handleTokenRequest })(Payments);