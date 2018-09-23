import React, { Component } from 'react';
import './ViewUsers.css';

class ViewUsers extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      submitted: false,
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/users/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  deleteUser(event,toDelete){
    event.preventDefault();
    var id = toDelete;
    fetch('http://localhost:8080/users/'+id, {
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
        <header className="App-header">
          <h1 className="App-title">All Users</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>EmailID</th>
              <th>Phone</th>
              <th>Username</th>
              <th>Password</th>
              <th>City</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map((item, key)=> {
               return (
                  <tr key = {key}>
                      <td>{item.id}</td>
                      <td>{item.emailid}</td>
                      <td>{item.phone}</td>
                      <td>{item.username}</td>
                      <td>{item.password}</td>
                      <td>{item.city}</td>
                      <td><input type="button" value='Delete' onClick={(e)=>{this.deleteUser(e,item.id)}} /></td>
                  </tr>
                )
             })}
          </tbody>
       </table>
       {this.state.submitted && window.location.reload()}
      </div>
    );
  }
}

export default ViewUsers;
