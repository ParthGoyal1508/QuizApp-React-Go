import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        userame: "",
        password: "",
      },
      submitted: false,
      error : null,
    }
    this.handleUChange = this.handleUChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/login', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
     credentials:'include'
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
        else{
          this.setState({submitted: false});
        }
      });
  }

  handleUChange(event) {
    this.state.formData.username = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create a New Person</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" value={this.state.userame} onChange={this.handleUChange}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={this.state.password} onChange={this.handlePChange}/>
            </div>
            <Link to={'/signup'}>New to Quizzer? Sign Up</Link><br></br>
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              User Logged In
            </h2>
          </div>
        }
        {!this.state.submitted &&
          <div>
            Error
          </div>
        }

      </div>
    );
  }
}

export default Login;