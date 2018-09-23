import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Signup extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        emailid: "",
        phone: "",
        userame: "",
        password: "",
        city: "",
      },
      submitted: false,
      error : null,
    }
    this.handleEChange = this.handleEChange.bind(this);
    this.handleMChange = this.handleMChange.bind(this);
    this.handleUChange = this.handleUChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleCChange = this.handleCChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/signup', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
        else{
          this.setState({submitted:false});
        }
      });
  }
  handleEChange(event) {
    this.state.formData.emailid = event.target.value;
  }
  handleMChange(event) {
    this.state.formData.phone = event.target.value;
  }
  handleUChange(event) {
    this.state.formData.username = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }
  handleCChange(event) {
    this.state.formData.city = event.target.value;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sign Up</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Email ID</label>
                <input type="emailid" className="form-control" value={this.state.emailid} onChange={this.handleEChange}/>
            </div>
            <div className="form-group">
                <label>Phone</label>
                <input type="number" className="form-control" value={this.state.phone} onChange={this.handleMChange}/>
            </div>
            <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" value={this.state.userame} onChange={this.handleUChange}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={this.state.password} onChange={this.handlePChange}/>
            </div>
            <div className="form-group">
                <label>City</label>
                <input type="text" className="form-control" value={this.state.city} onChange={this.handleCChange}/>
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New Account Created!
            </h2>
             This has been printed using conditional rendering.
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

export default Signup;