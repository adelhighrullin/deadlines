import React, { Component } from 'react';
import axios from 'axios';

export default class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = async () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => this.setState({ tasks: res.data }))
      .catch((err) => console.log(err));
  };

  renderTasks = () => {
    const newTasks = this.state.tasks;

    return newTasks.map((task) => (
      <div>
        <p>{task.name}</p>
        <p>{task.description}</p>
      </div>
    ));
  }

  render() {
    return (
      <div className="TaskList">
        <p>Task List</p>
        {this.renderTasks()}
      </div>
    );
  }
}