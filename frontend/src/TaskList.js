import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8000/tokens/refresh/',
//   timeout: 5000,
//   headers: {
//     'Authorization': `JWT ${localStorage.getItem('access_token')}`,
//     'Content-Type': 'application/json',
//     'accept': 'application/json'
//   }
// });

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

  refreshList = () => {

    const authRequest = axios.create({
      baseURL: "http://localhost:8000/",
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      }
    });

    authRequest.interceptors.request.use(
      config => {
        const access_token = localStorage.getItem('access_token');
        config.headers['Authorization'] = `JWT ${access_token}`;
        return config;
      },
      error => {
        Promise.reject(error)
      }
    );

    authRequest.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
          originalRequest._retry = true;
          console.log('it goes to post now')
          const refresh_token = localStorage.getItem('refresh_token');
          await authRequest
            .post('/tokens/refresh/', { refresh: refresh_token })
            .then((response) => {
              localStorage.setItem('access_token', response.data.access);
              authRequest.defaults.headers['Authorization'] = `JWT ${response.data.access}`;
              // it should not be like that, but for now it works
              // it still gives 401 error, but after page reloading
              // it makes get request and takes the data

              // authRequest
              //   .get('/api/tasks/')
              //   .then((res) => this.setState({ tasks: res.data }))
              //   .then(console.log('get requested'))
              //   .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err))
          return authRequest(originalRequest);
        }
        return Promise.reject(error);
      }
    )

    authRequest
      .get('/api/tasks/')
      .then((res) => this.setState({ tasks: res.data }))
      .then(console.log('get requested'))
      .catch((err) => console.log(err));

    // axios
    //   .get("http://localhost:8000/api/tasks/", {
    //     headers: {
    //       "Authorization": `JWT ${localStorage.getItem('access_token')}`
    //     }
    //   })
    //   .then((res) => this.setState({ tasks: res.data }))
    //   .catch((err) => console.log(err));
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
          "Authorization": `JWT ${localStorage.getItem('access_token')}`,
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
      .delete(`http://localhost:8000/api/tasks/${task.id}/`, {
        headers: {
          "Authorization": `JWT ${localStorage.getItem('access_token')}`
        }
      })
      .then((res) => this.refreshList())
      .catch((err) => console.log(err));
  };

  renderTasks = () => {
    const getTasks = this.state.tasks;
    return getTasks.map((task) => (
      <div className="Task">
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
            <Modal className="Modal" isOpen={this.state.modal}>
              <input
                type="text"
                name="name"
                value={this.state.chosenTask.name}
                placeholder="Task name:"
                onChange={this.handleChange}
              /><br />
              <input
                type="text"
                name="description"
                value={this.state.chosenTask.description}
                placeholder="Description:"
                onChange={this.handleChange}
              /><br />
              <input
                type="checkbox"
                name="done"
                value={this.state.chosenTask.done}
                onChange={this.handleChange}
              /><br />
              <button onClick={() => this.handleSubmit(this.state.chosenTask)}>submit</button>
              <button onClick={this.handleCancel}>cancel</button>
            </Modal>
          ) : null
        }
      </div>
    );
  }
}