import React, { Component } from 'react';
import Home from './Home';
import Signup from './/Signup';
import Login from './Login';
import ViewUsers from './ViewUsers';
import Quiz from './Quiz';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <Link className="navbar-brand" to={'/'}>Quizzer</Link>
                </div>
                <ul className="nav navbar-nav">
                  <li><Link to={'/'}>Home</Link></li>
                  <li><Link to={'/login'}>Signup/Login</Link></li>
                  <li><Link to={'/users'}>View Users</Link></li>
                  <li><Link to={'/quiz'}>Create Quiz</Link></li>
                </ul>
              </div>
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />
                 <Route exact path='/login' component={Login} />
                 <Route exact path='/signup' component={Signup} />
                 <Route exact path='/users' component={ViewUsers} />
                 <Route exact path='/quiz' component={Quiz} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
