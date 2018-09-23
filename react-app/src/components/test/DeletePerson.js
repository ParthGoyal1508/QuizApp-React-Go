import React, { Component } from 'react';
import './DeletePerson.css';

class DeletePerson extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      toDelete: [],
      submitted : false,
    }
    this.deleteP = this.deleteP.bind(this);
  }

  deleteP(event) {
    this.state.toDelete.push(event.target.value);
    console.log(this.state.toDelete)
  }

  handleSubmit  = (event)=> {
    event.preventDefault();
    for(var i=0;i < this.state.toDelete.length;i++)
    {
      var id = this.state.toDelete[i];
      fetch('http://localhost:8080/people/'+id, {
      method: 'DELETE',
       })
          .then(response => {
            if(response.status >= 200 && response.status < 300)
            this.setState({submitted: true});
          });
    }
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/people/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Delete a Person</h1>
        </header>

        <form onSubmit={this.handleSubmit}>
          <table className="table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>{this.state.data.map((item, key) => {
                 return (
                    <tr key = {key}>
                        <td>{item.id}</td>
                        <td>{item.firstname}</td>
                        <td>{item.lastname}</td>
                        <td>{item.city}</td>
                        <td><input type="radio" value={item.id} onClick={this.deleteP} /></td>
                    </tr>
                  )
               })}
            </tbody>
          </table>

          <button type="submit" className="btn btn-default">Submit</button>
       </form>
       
      {this.state.submitted && window.location.reload()}
      </div>
    );
  }
}

export default DeletePerson;
