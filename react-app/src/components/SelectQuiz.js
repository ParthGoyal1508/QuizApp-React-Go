import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class SelectQuiz extends Component {
  constructor() {
    super();
    this.state = {
      data:[],
      quizid: null,
      submitted: false,
      error : null,
      loggedin : localStorage.getItem("username")
    }
    this.handleNChange = this.handleNChange.bind(this);
    this.handleGChange = this.handleGChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  static contextTypes={
    router: PropTypes.object,
  }

  handleSubmit (event) {
    event.preventDefault();
    (this.state.quizid === null)?this.setState({error: "Select A Valid Quiz"}):this.setState({submitted: true});
  }

  handleNChange(event) {
    this.state.quizid = event.target.value;
  }

  handleGChange(event) {;
    event.preventDefault();
    const request = new Request('http://127.0.0.1:8080/genre/'+event.target.value);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data:data}));
    console.log(this.state.data);
  }

  render() {

    return (
      <div className="App">
      {this.state.loggedin!=null &&
      <div>
        <header className="App-header">
          <h1 className="App-title">Create Quiz</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Enter Quiz Genre :</label>
                <select value={this.state.genre} onChange={this.handleGChange}>
                  <option value ="" selected=""> Select </option>
                  <option value ="movies"> Movies </option>
                  <option value ="sports"> Sports </option>
                  <option value ="politics"> Politics </option>
                </select>
            </div>
            <div className="form-group">
                <label>Enter Quiz Name :</label>
                <select value={this.state.name} onChange={this.handleNChange}>
                  <option value ="" selected=""> Select </option>
                  {this.state.data.map((item,key)=>{
                    return(
                    <option value ={item.id} > {item.name} </option>
                  )})}
                </select>
            </div>
            <button type="submit" className="btn btn-default">Play</button>
          </form>
        </div>

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

export default SelectQuiz;