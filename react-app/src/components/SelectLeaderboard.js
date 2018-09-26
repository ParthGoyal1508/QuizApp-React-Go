import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class SelectLeaderboard extends Component {
  constructor() {
    super();
    this.state = {
      submitted: false,
      error : null,
      loggedin : localStorage.getItem("username")
    }
    this.handleLChange = this.handleLChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleMChange = this.handleMChange.bind(this);
    this.handleSChange = this.handleSChange.bind(this);
  }
  static contextTypes={
    router: PropTypes.object,
  }


  handleLChange(event) {
    event.preventDefault();
    this.context.router.history.push("/leaderboard")
  }
  handleMChange(event) {
    event.preventDefault();
    this.context.router.history.push("/leaderboard/movies")
  }
  handleSChange(event) {
    event.preventDefault();
    this.context.router.history.push("/leaderboard/sports")
  }
  handlePChange(event) {
    event.preventDefault();
    this.context.router.history.push("/leaderboard/politics")
  }

  render() {

    return (
      <div className="App">
      {this.state.loggedin!=null &&
      <div>
        <header className="App-header">
          <h1 className="App-title">Select Leaderboard</h1>
        </header>
        <br/><br/>
        <button onClick= {this.handleLChange}>General Leaderboard</button>
        <button onClick= {this.handleMChange}>Movies Leaderboard</button>
        <button onClick= {this.handleSChange}>Sports Leaderboard</button>
        <button onClick= {this.handlePChange}>Politics Leaderboard</button>

        {this.state.submitted && this.context.router.history.push("/playquiz/"+this.state.quizid)}
        {!this.state.submitted &&
          <div>
            {this.state.error}
          </div>
        }
        </div>
      }
      { this.state.loggedin==null &&
      <div>
        <h1>You must be logged in!</h1>
      </div>
      }
      </div>
    );
  }
}

export default SelectLeaderboard;