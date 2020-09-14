import React from "react";
import * as actions from '../../actions';
import { connect } from 'react-redux';

class PaymentSuccess extends React.Component {
  state = { time: 5 };
  componentDidMount() {
    setTimeout(() => {
      this.props.fetchUser();
      this.props.history.push('/surveys');
    }, 5000);
    this.intervalId = setInterval(() => { this.setState({ time: this.state.time - 1 }) }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  render() {
    return <h5>Payment Success! Redirecting to the homepage throught {this.state.time} seconds.</h5>;
  }
}

export default connect(null, actions)(PaymentSuccess);