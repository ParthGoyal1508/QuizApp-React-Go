import React, { Component } from 'react';

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
    }
    this.handleNChange = this.handleNChange.bind(this);
    this.handleGChange = this.handleGChange.bind(this);
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
  handleNChange(event) {
    this.state.formData.name = event.target.value;
  }
  handleGChange(event) {
    this.state.formData.genre = event.target.value;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create Quiz</h1>
        </header>
        <br/><br/>
        <Quiz/>
        <Questions/>
      </div>
    );
  }
}

export default CreateQuiz;