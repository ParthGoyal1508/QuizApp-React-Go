import React, { Component } from 'react';
import Home from './Home';
import Signup from './/Signup';
import Login from './Login';
import ViewUsers from './ViewUsers';
import CreateQuiz from './CreateQuiz';
import ViewQuiz from './ViewQuiz';
import CreateQuestion from './CreateQuestion';
import ViewQuestion from './ViewQuestion';
import SelectQuiz from './SelectQuiz';
import PlayQuiz from './PlayQuiz';
import EditQuestion from './EditQuestion';
import Logout from './Logout';
import ViewGames from './ViewGames';
import Leaderboard from './Leaderboard';
import Moviesboard from './Moviesboard';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedin : localStorage.getItem("username")
    }
  }
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
                {/* {this.state.loggedin==null && */}
                {/* <div> */}
                  <li><Link to={'/'}>Home</Link></li>
                  <li><Link to={'/login'}>Signup/Login</Link></li>
                {/* </div> */}
                {/* } */}
                {/* {this.state.loggedin!=null && this.state.loggedin!="admin" && */}
                {/* <div> */}
                  <li><Link to={'/playquiz'}>Play Quiz</Link></li>
                  {/* <li><Link to={'/logout'}>Logout</Link></li> */}
                {/* </div> */}
                {/* } */}
                {/* {this.state.loggedin=="admin" && */}
                {/* <div> */}
                  <li><Link to={'/users'}>View Users</Link></li>
                  <li><Link to={'/makequiz'}>Create Quiz</Link></li>
                  <li><Link to={'/quiz'}>View Quizzes</Link></li>
                  <li><Link to={'/viewgames'}>View Games</Link></li>
                  <li><Link to={'/leaderboard'}>Leaderboard</Link></li>
                  <li><Link to={'/moviesboard'}>Leaderboard for Movies</Link></li>
                  <li><Link to={'/logout'}>Logout</Link></li>
                {/* </div> */}
                {/* } */}
                </ul>
              </div>
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />
                 <Route exact path='/login' component={Login} />
                 <Route exact path='/signup' component={Signup} />
                 <Route exact path='/users' component={ViewUsers} />
                 <Route exact path='/makequiz' component={CreateQuiz} />
                 <Route exact path='/quiz' component={ViewQuiz} />
                 <Route exact path='/addques/:id' component={CreateQuestion} />
                 <Route exact path='/editques/:id' component={EditQuestion} />
                 <Route exact path='/question/:id' component={ViewQuestion} />
                 <Route exact path='/playquiz' component={SelectQuiz} />
                 <Route exact path='/playquiz/:id' component={PlayQuiz} />
                 <Route exact path='/viewgames' component={ViewGames} />
                 <Route exact path='/leaderboard' component={Leaderboard} />
                 <Route exact path='/moviesboard' component={Moviesboard} />
                 <Route exact path='/logout' component={Logout} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
