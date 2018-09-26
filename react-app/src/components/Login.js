import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        password: "",
      },
      submitted: false,
      error : null,
      loggedin : localStorage.getItem("username")
    }
    this.handleUChange = this.handleUChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  static contextTypes={
    router: PropTypes.object,
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/login', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
     credentials:'include'
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300){
        this.setState({submitted: true});
        localStorage.setItem("username",this.state.formData.username);
        } else{
          response.json()
          .then(data => this.setState({"error" : data.error}));
          this.setState({submitted:false});
        }
      });
  }

  handleUChange(event) {
    this.state.formData.username = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }
  // Google = (response) => {
  //   console.log(response);
  // }
   
  render() {

    return (
      <div className="App">
      {this.state.loggedin == null &&
      <div>
        <header className="App-header">
          <h1 className="App-title">Create a New Person</h1>
        </header>
        <br/><br/>
        {/* <GoogleLogin
          clientId=" 886670645771-luv4ij7j6drkigljve5li66vu40fd6cp.apps.googleusercontent.com "
          buttonText="Login"
          onSuccess={ this.Google}
          onFailure={ this.Google}
          /> */}
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

        {this.state.submitted && window.location.reload() && this.context.router.history.push("/") &&
        <div>
            <h2>
              User Logged In
            </h2>
          </div>
        }
        {!this.state.submitted &&
          <div>
            {this.state.error}
          </div>
        }
        </div>
      }
      { this.state.loggedin!=null &&
      <div>
        <h1>You are already logged in!</h1>
      </div>
      }
      </div>
    );
  }
}

export default Login;