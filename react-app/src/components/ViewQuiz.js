import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ViewUsers.css';

class ViewQuiz extends Component {
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
    const request = new Request('http://127.0.0.1:8080/quiz/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  editQuiz(event,id){
    event.preventDefault();
    this.context.router.history.push("/question/"+id)
}

  deleteQuiz(event,toDelete){
    event.preventDefault();
    var id = toDelete;
    fetch('http://localhost:8080/quiz/'+id, {
    method: 'DELETE',
      })
        .then(response => {
          if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
        });
  }

  render() {
    return (
      <div className="App">
      {this.state.loggedin=="admin" &&
      <div>
        <header className="App-header">
          <h1 className="App-title">All Quizzes</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Genre</th>
              <th>Add Questions</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map((item, key)=> {
               return (
                  <tr key = {key}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.genre}</td>
                      <td><input type="button" value='Edit' onClick={ (e)=>{this.editQuiz(e,item.id)} } /></td>
                      <td><input type="button" value='Delete' onClick={ (e)=>{ this.deleteQuiz(e,item.id) } } /></td>
                  </tr>
                )
             })}
          </tbody>
       </table>
       {this.state.submitted && window.location.reload()}
       </div>
      }
      { this.state.loggedin!="admin" &&
      <div>
        <h1>You must have Admin Access!</h1>
      </div>
      }
      </div>
    );
  }
}

export default ViewQuiz;
