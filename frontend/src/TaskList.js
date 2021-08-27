import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chosenTask: this.props.chosenTask,
      modal: false,
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

  handleChange = (event) => {
    const { name, value } = event.target;
    const taskOnChange = this.state.chosenTask;
    taskOnChange[name] = event.target.type === 'checkbox' ? event.target.checked : value;
    this.setState({ chosenTask: taskOnChange });
  };

  handleCancel = () => {
    this.setState({ modal: !this.state.modal });
    this.refreshList();
  };

  handleSubmit = (task) => {
    axios
      .post(`http://127.0.0.1:8000/api/tasks/`, task, {
        "headers": {
          "Content-Type": "application/json",
        },
      })
      .then((res) => this.refreshList())
      .catch((err) => console.log(err));
    this.setState({ modal: !this.state.modal });
  };

  addTask = () => {
    const newTask = { name: "", description: "", done: false }
    this.setState({
      chosenTask: newTask,
      modal: !this.state.modal
    });
  };

  editTask = (task) => {
    this.setState({
      chosenTask: task,
      modal: !this.state.modal
    });
  };

  deleteTask = (task) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${task.id}/`)
      .then((res) => this.refreshList())
      .catch((err) => console.log(err));
  };

  renderTasks = () => {
    const getTasks = this.state.tasks;
    return getTasks.map((task) => (
      <div>
        <p>{task.name}</p>
        <p>{task.description}</p>
        <button onClick={() => this.editTask(task)}>Edit</button>
        <button onClick={() => this.deleteTask(task)}>Delete</button>
      </div >
    ));
  };

  render() {
    return (
      <div className="TaskList">
        <p>Task List</p>
        <button onClick={this.addTask}>Add task</button>
        {this.renderTasks()}
        {
          this.state.modal ? (
            <Modal isOpen={this.state.modal}>
              <input
                type="text"
                name="name"
                value={this.state.chosenTask.name}
                placeholder="Task name:"
                onChange={this.handleChange}
              />
              <input
                type="text"
                name="description"
                value={this.state.chosenTask.description}
                placeholder="Description:"
                onChange={this.handleChange}
              />
              <input
                type="checkbox"
                name="done"
                value={this.state.chosenTask.done}
                onChange={this.handleChange}
              />
              <button onClick={() => this.handleSubmit(this.state.chosenTask)}>submit</button>
              <button onClick={this.handleCancel}>cancel</button>
            </Modal>
          ) : null
        }
      </div>
    );
  }
}