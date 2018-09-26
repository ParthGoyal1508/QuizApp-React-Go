import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Logout extends Component {
  static contextTypes={
    router: PropTypes.object,
  }

  render() {

    return (
      <div className="App">
        {localStorage.removeItem("username")}
        {window.location.reload()}
        {this.context.router.history.push("/")}
      </div>
    );
  }
}


export default Logout;