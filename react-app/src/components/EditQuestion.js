import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class EditQuestion extends Component {
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
      loggedin : localStorage.getItem("username")
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
  static contextTypes={
    router: PropTypes.object,
  }

  componentDidMount() {
    var id = this.props.match.params.id;
    const request = new Request('http://127.0.0.1:8080/ques/'+id);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({formData: data}));
  }

  handleSubmit (event) {
    event.preventDefault();
    var id = this.props.match.params.id;
    var sum = 0;
    sum+=(this.state.formData.vala == true)?1:0;
    sum+=(this.state.formData.valb == true)?1:0;
    sum+=(this.state.formData.valc == true)?1:0;
    sum+=(this.state.formData.vald == true)?1:0;
    this.state.formData.type = (sum>1)?1:0;
    fetch('http://localhost:8080/editques/'+id, {
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
    let data = {...this.state.formData, "name" : event.target.value};
    this.setState({formData : data});
  }
  handleQAChange(event) {
    let data = {...this.state.formData, "opta" : event.target.value};
    this.setState({formData : data});
  }
  handleQBChange(event) {
    let data = {...this.state.formData, "optb" : event.target.value};
    this.setState({formData : data});
  }
  handleQCChange(event) {
    let data = {...this.state.formData, "optc" : event.target.value};
    this.setState({formData : data});
  }
  handleQDChange(event) {
    let data = {...this.state.formData, "optd" : event.target.value};
    this.setState({formData : data});
  }
  handleVAChange(event) {
    let data = {...this.state.formData, "vala" : !this.state.formData.vala};
    this.setState({formData : data});
  }
  handleVBChange(event) {
    let data = {...this.state.formData, "valb" : !this.state.formData.valb};
    this.setState({formData : data});
  }
  handleVCChange(event) {
    let data = {...this.state.formData, "valc" : !this.state.formData.valc};
    this.setState({formData : data});
  }
  handleVDChange(event) {
    let data = {...this.state.formData, "vald" : !this.state.formData.vald};
    this.setState({formData : data});
  }

  render() {

    return (
      <div className="App">
      {this.state.loggedin=="admin" &&
      <div>
        <header className="App-header">
          <h1 className="App-title">Sign Up</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Question Statement</label>
                <input type="text" className="form-control" value={this.state.formData.name} onChange={this.handleNChange}/>
            </div>
            <div className="form-group">
                <label>Option A</label>
                <input type="text" className="form-control" value={this.state.formData.opta} onChange={this.handleQAChange}/>
            </div>
            <div className="form-group">
                <label>Option B</label>
                <input type="text" className="form-control" value={this.state.formData.optb} onChange={this.handleQBChange}/>
            </div>
            <div className="form-group">
                <label>Option C</label>
                <input type="text" className="form-control" value={this.state.formData.optc} onChange={this.handleQCChange}/>
            </div>
            <div className="form-group">
                <label>Option D</label>
                <input type="text" className="form-control" value={this.state.formData.optd} onChange={this.handleQDChange}/>
            </div>

            <h1>Solution:</h1><br></br>
            <div>
              <label>A</label>
              <input type="checkbox" className="form-control" onClick={this.handleVAChange} checked={this.state.formData.vala}/>
            </div>
            <div>
              <label>B</label>
              <input type="checkbox" className="form-control" onClick={this.handleVBChange} checked={this.state.formData.valb}/>
            </div>
            <div>
              <label>C</label>
              <input type="checkbox" className="form-control" onClick={this.handleVCChange} checked={this.state.formData.valc}/>
            </div>
            <div>
              <label>D</label>
              <input type="checkbox" className="form-control" onClick={this.handleVDChange} checked={this.state.formData.vald}/>
            </div>

            <button type="submit" className="btn btn-default" onClick={this.handleSubmit}>Submit</button>
          </form>
        </div>

        {this.state.submitted && this.context.router.history.push("/question/"+this.state.formData.quizid)}
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

export default EditQuestion;