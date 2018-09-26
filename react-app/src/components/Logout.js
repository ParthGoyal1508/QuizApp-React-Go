import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Logout extends Component {


  render() {

    return (
      <div className="App">
        {localStorage.removeItem("username")}
      </div>
    );
  }
}

export default Logout;