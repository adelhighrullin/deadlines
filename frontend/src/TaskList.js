import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom'
import axios from 'axios';
// import Modal from 'react-modal';

import { Button, Card, Container, Col, Form, Modal, Nav, Navbar, Row } from 'react-bootstrap'

// Modal.setAppElement('#root');

const baseURL = "http://localhost:8000/";

const authRequest = axios.create({
  baseURL: baseURL,
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
    return Promise.reject(error)
  }
);

authRequest.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // if (error.response.status === 401 && originalRequest.url === baseURL + "tokens/refresh/") {
    //   localStorage.clear();
    //   window.location.href = "/";
    //   return Promise.reject(error);
    // }
    if (!localStorage.getItem('access_token')) {
      return Promise.reject(error);
    }
    if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      originalRequest._retry = true;
      console.log('it goes to post now')
      const refresh_token = localStorage.getItem('refresh_token');
      await authRequest
        .post('/tokens/refresh/', { refresh: refresh_token })
        .then((response) => {
          localStorage.setItem('access_token', response.data.access);
          authRequest.defaults.headers['Authorization'] = `JWT ${response.data.access}`;
        })
        .catch((err) => console.log(err))
      return authRequest(originalRequest);
    }
    return Promise.reject(error);
  }
)

export default class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chosenTask: this.props.chosenTask,
      isNewTask: false,
      modal: false,
      tasks: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  };

  logOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('now not authorized')
    authRequest.defaults.headers['Authorization'] = null;
    window.location.href = '/';
  };

  refreshList = () => {
    authRequest
      .get('/api/tasks/')
      .then(
        (res) => this.setState({ tasks: res.data }))
      .then(console.log('get requested'))
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
    //post for new tasks, put for existing ones
    this.state.isNewTask ?
      authRequest
        .post('/api/tasks/', task)
        .then((res) => this.refreshList())
        .catch((err) => console.log(err))
      :
      authRequest
        .put(`/api/tasks/${task.id}/`, task)
        .then((res) => this.refreshList())
        .catch((err) => console.log(err))
    this.setState({ modal: !this.state.modal });
  };

  addTask = () => {
    const newTask = { name: "", description: "", done: false }
    this.setState({
      chosenTask: newTask,
      isNewTask: true,
      modal: !this.state.modal
    });
  };

  editTask = (task) => {
    this.setState({
      chosenTask: task,
      isNewTask: false,
      modal: !this.state.modal
    });
  };

  deleteTask = (task) => {
    authRequest
      .delete(`/api/tasks/${task.id}`)
      .then((res) => this.refreshList())
      .catch((err) => console.log(err));
  };

  renderTasks = () => {
    const getTasks = this.state.tasks;
    return getTasks.map((task, idx) => (
      <div key={idx} className="Tasklist">
        <Container className="mb-5">
          <Row className="justify-content-md-center mb-3">
            <Col xs={6} md={4}>
              <Card>
                <Card.Body className="text-center">
                  <Card.Title>{task.name}</Card.Title>
                  <Card.Text>{task.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button className="ml-auto" onClick={() => this.editTask(task)}>Edit</Button>
                  <Button className="ml-auto" variant="danger" onClick={() => this.deleteTask(task)}>Delete</Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* <p>{task.name}</p>
        <p>{task.description}</p>
        <button onClick={() => this.editTask(task)}>Edit</button>
        <button onClick={() => this.deleteTask(task)}>Delete</button> */}
      </div >
    ));
  };

  render() {
    return (
      <div>
        {!localStorage.getItem('access_token')
          ? <Redirect to="/" />
          : <div className="TaskList">
            <Navbar bg="dark" className="mb-3" /*fixed*/ sticky="top">
              <Container fluid="md">
                <Navbar.Brand className="text-white">deadlines</Navbar.Brand>
                <Nav>
                  <Button variant="dark" onClick={this.logOut}>Log out</Button>
                </Nav>
              </Container>
            </Navbar>
            <Container className="text-center mb-3">
              <Button onClick={this.addTask}>Add task</Button>
            </Container>
            {this.renderTasks()}
            {/* <p>Task List</p>
            <button onClick={this.addTask}>Add task</button> */}
            {
              this.state.modal ? (
                <Modal show={this.state.modal} onHide={this.handleCancel}>
                  <Modal.Header closeButton>
                    <Modal.Title>Editing</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={() => this.handleSubmit(this.state.chosenTask)}>
                    <Modal.Body>
                      <Container>
                        <Row>
                          <Col>
                            <Form.Control
                              type="text"
                              name="name"
                              value={this.state.chosenTask.name}
                              onChange={this.handleChange}
                              placeholder="Task name:"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Control
                              type="text"
                              name="description"
                              value={this.state.chosenTask.description}
                              onChange={this.handleChange}
                              placeholder="Description:"
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleCancel}>Cancel</Button>
                      <Button type="submit">Submit</Button>
                    </Modal.Footer>
                  </Form>
                </Modal>
                // <Modal className="Modal" isOpen={this.state.modal}>
                //   <form onSubmit={() => this.handleSubmit(this.state.chosenTask)}>
                //     <input
                //       type="text"
                //       name="name"
                //       value={this.state.chosenTask.name}
                //       placeholder="Task name:"
                //       onChange={this.handleChange}
                //     /><br />
                //     <input
                //       type="text"
                //       name="description"
                //       value={this.state.chosenTask.description}
                //       placeholder="Description:"
                //       onChange={this.handleChange}
                //     /><br />
                //     <input
                //       type="checkbox"
                //       name="done"
                //       value={this.state.chosenTask.done}
                //       onChange={this.handleChange}
                //     /><br />
                //     <button type="submit">submit</button>
                //     <button onClick={this.handleCancel}>cancel</button>
                //   </form>
                // </Modal>
              ) : null
            }
            {/* <button onClick={this.logOut}>Log out</button> */}
            <Navbar bg="dark" fixed="bottom">
              <Container fluid="md">
                <Navbar.Brand className="text-white">bottom text 2021</Navbar.Brand>
              </Container>
            </Navbar>
          </div>
        }

      </div>
    );
  }
}