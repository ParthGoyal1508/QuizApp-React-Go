import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ViewUsers.css';

class ViewQuestion extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      submitted: false,
      loggedin : localStorage.getItem("username")
    }
  }
  static contextTypes={
    router: PropTypes.object,
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    var qid = this.props.match.params.id;
    const request = new Request('http://127.0.0.1:8080/question/'+qid);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  deleteQuestion(event,toDelete){
    event.preventDefault();
    var id = toDelete;
    fetch('http://localhost:8080/delques/'+id, {
    method: 'DELETE',
      })
        .then(response => {
          if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
        });
  }
  addQuestion(event,id){
    event.preventDefault();
    this.context.router.history.push("/addques/"+id);
  }
  editQuestion(event,id){
    event.preventDefault();
    this.context.router.history.push("/editques/"+id);
  }

  render() {
    console.log(this.state.data)
    return (
      <div className="App">
      {this.state.loggedin=="admin" &&
      <div>
        <header className="App-header">
          <h1 className="App-title">All Questions</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>QuizID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Opt A</th>
              <th>Opt B</th>
              <th>Opt C</th>
              <th>Opt D</th>
              <th>Val A</th>
              <th>Val B</th>
              <th>Val C</th>
              <th>Val D</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map((item, key)=> {
               return (
                  <tr key = {key}>
                      <td>{item.id}</td>
                      <td>{item.quizid}</td>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.opta}</td>
                      <td>{item.optb}</td>
                      <td>{item.optc}</td>
                      <td>{item.optd}</td>
                      <td>{item.vala.toString()}</td>
                      <td>{item.valb.toString()}</td>
                      <td>{item.valc.toString()}</td>
                      <td>{item.vald.toString()}</td>
                      <td><input type="button" value='Edit'onClick={(e)=>{this.editQuestion(e,item.id)}} /></td>
                      <td><input type="button" value='Delete' onClick={ (e)=>{ this.deleteQuestion(e,item.id) } } /></td>
                  </tr>
                )
             })}
          </tbody>
       </table>
       <input type="button" value='Add Question' onClick={ (e)=>{ this.addQuestion(e,this.props.match.params.id) } } />
       {this.state.submitted && window.location.reload()}
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

export default ViewQuestion;
