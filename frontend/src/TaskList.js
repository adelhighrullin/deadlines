import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      tasks: [],
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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

  handleCloseModal = () => {
    this.setState({ openModal: false });
  }

  handleOpenModal = () => {
    this.setState({ openModal: true });
  }

  deleteTask = (task) => {
    this.setState({ openModal: !this.state.openModal })
  };

  editTask = (task) => {
    this.handleOpenModal();
    console.log("edit clicked");
    console.log(this.state.openModal);
    /*
    return (
      <div>
        <Modal
          isOpen={this.state.openModal}
        >
          <p>modal window hehehehlksdjfkjafh</p>
          <p>this is clicked task name: {task.name}</p>
          <button onClick={this.handleCloseModal}>close ths windwo</button>
        </Modal>
      </div>
    );
    */
  };

  renderTasks = () => {
    const getTasks = this.state.tasks;

    return getTasks.map((task) => (
      <div>
        <p>{task.name}</p>
        <p>{task.description}</p>
        <button onClick={() => this.editTask(task)}>Edit</button>
        <Modal
          isOpen={this.state.openModal}
        >
          <p>modal window hehehehlksdjfkjafh</p>
          <p>this is clicked task name: {task.name}</p>
          <button onClick={this.handleCloseModal}>close ths windwo</button>
        </Modal>
        <button onClick={() => this.deleteTask(task)}>Delete</button>
      </div>
    ));
  }

  render() {
    return (
      <div className="TaskList">
        <p>Task List</p>
        {this.renderTasks()}
        <button onClick={this.handleOpenModal}>faihroieuqhibf</button>
        <Modal
          isOpen={this.state.openModal}
        >
          <p>slkdjfsldfkjsdf test test etst</p>
          <button onClick={this.handleCloseModal}></button>
        </Modal>
      </div>
    );
  }
}