import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class PlayQuiz extends Component {
  constructor() {
    super();
    this.state = {
      data:[],
      quizid: null,
      submitted: false,
      error : null,
    }
    this.handleNChange = this.handleNChange.bind(this);
    this.handleGChange = this.handleGChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    console.log(this.state);
    fetch('http://localhost:8080/playquiz', {
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
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New Quiz Created!
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

export default PlayQuiz;