import React, { Component } from 'react'
import './App.css';

import TaskList from './TaskList';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <TaskList />
      </div>
    );
  }
}