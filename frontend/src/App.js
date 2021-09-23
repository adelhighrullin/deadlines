import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';

import Login from './Login';
import Register from './Register';
import TaskList from './TaskList';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/tasklist" component={TaskList} /*render={(props) => <TaskList {...props}/>} */ />
            <Route path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    );
  }
}