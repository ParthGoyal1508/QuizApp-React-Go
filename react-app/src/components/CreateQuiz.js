import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class CreateQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: "",
        genre: "",
      },
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
    fetch('http://localhost:8080/makequiz', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
        else{
          response.json()
          .then(data=>this.setState({"error" : data.error}))
          this.setState({submitted:false});
        }
      });
  }

  handleNChange(event) {
    this.state.formData.name = event.target.value;
  }
  handleGChange(event) {
    this.state.formData.genre = event.target.value;
  }

  render() {

    return (
      <div className="App">
      {this.state.loggedin=="admin" &&
      <div>
        <header className="App-header">
          <h1 className="App-title">Create Quiz</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Enter Quiz Name :</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.handleNChange}/>
            </div>
            <div className="form-group">
                <label>Enter Quiz Genre :</label>
                <select value={this.state.genre} onChange={this.handleGChange}>
                  <option value ="" selected=""> Select </option>
                  <option value ="movies"> Movies </option>
                  <option value ="sports"> Sports </option>
                  <option value ="politics"> Politics </option>
                </select>
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted && this.context.router.history.push("/quiz")}
        {!this.state.submitted &&
          <div>
            {this.state.error}
          </div>
        }
      </div>
      }
      { this.state.loggedin!="admin" &&
      <div>
        <h1>You must have Admin Access</h1>
      </div>
      }
      </div>
    );
  }
}

export default CreateQuiz;