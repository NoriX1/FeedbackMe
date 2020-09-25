import React from 'react';

const Landing = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>feedback.io</h1>
      <div>Welcome to feedback.io! Collect feedback from your users</div>
      <a
        href="/auth/google"
        className="teal btn-flat white-text"
        style={{ marginTop: "10px" }}
      >Sign in to continue!</a>
    </div>
  );
}

export default Landing;