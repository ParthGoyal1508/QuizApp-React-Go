import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class CreateQuestion extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        quizid: 0,
        name: "",
        type: 0,
        opta: "",
        optb: "",
        optc: "",
        optd: "",
        vala: false,
        valb: false,
        valc: false,
        vald: false,
      },
      submitted: false,
      error : null,
    }
    this.handleNChange = this.handleNChange.bind(this);
    this.handleQAChange = this.handleQAChange.bind(this);
    this.handleQBChange = this.handleQBChange.bind(this);
    this.handleQCChange = this.handleQCChange.bind(this);
    this.handleQDChange = this.handleQDChange.bind(this);
    this.handleVAChange = this.handleVAChange.bind(this);
    this.handleVBChange = this.handleVBChange.bind(this);
    this.handleVCChange = this.handleVCChange.bind(this);
    this.handleVDChange = this.handleVDChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    var qid = this.props.match.params.id;
    this.state.formData.quizid = qid;
    console.log(this.state.formData);
    fetch('http://localhost:8080/addques', {
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
  handleQAChange(event) {
    this.state.formData.opta = event.target.value;
  }
  handleQBChange(event) {
    this.state.formData.optb = event.target.value;
  }
  handleQCChange(event) {
    this.state.formData.optc = event.target.value;
  }
  handleQDChange(event) {
    this.state.formData.optd = event.target.value;
  }
  handleVAChange(event) {
    this.state.formData.vala = (!this.state.formData.vala);
  }
  handleVBChange(event) {
    this.state.formData.valb = (!this.state.formData.valb);
  }
  handleVCChange(event) {
    this.state.formData.valc = (!this.state.formData.valc);
  }
  handleVDChange(event) {
    this.state.formData.vald = (!this.state.formData.vald);
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
                <label>Question Statement</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.handleNChange}/>
            </div>
            <div className="form-group">
                <label>Option A</label>
                <input type="text" className="form-control" value={this.state.opta} onChange={this.handleQAChange}/>
            </div>
            <div className="form-group">
                <label>Option B</label>
                <input type="text" className="form-control" value={this.state.optb} onChange={this.handleQBChange}/>
            </div>
            <div className="form-group">
                <label>Option C</label>
                <input type="text" className="form-control" value={this.state.optc} onChange={this.handleQCChange}/>
            </div>
            <div className="form-group">
                <label>Option D</label>
                <input type="text" className="form-control" value={this.state.optd} onChange={this.handleQDChange}/>
            </div>

            <h>Solution:</h><br></br>
            <div>
              <label>A</label>
              <input type="checkbox" className="form-control" onClick={this.handleVAChange}/>
            </div>
            <div>
              <label>B</label>
              <input type="checkbox" className="form-control" onClick={this.handleVBChange}/>
            </div>
            <div>
              <label>C</label>
              <input type="checkbox" className="form-control" onClick={this.handleVCChange}/>
            </div>
            <div>
              <label>D</label>
              <input type="checkbox" className="form-control" onClick={this.handleVDChange}/>
            </div>

            <button type="submit" className="btn btn-default" onClick={this.handleSubmit}>Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New Question Created!
            </h2>
             This has been printed using conditional rendering.
          </div>
        }
        {!this.state.submitted &&
          <div>
            ErrorQ
          </div>
        }
      </div>
    );
  }
}

export default CreateQuestion;