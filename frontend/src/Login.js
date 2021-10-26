import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';

import { Button, Container, Col, Form, Nav, Navbar, Row } from 'react-bootstrap'

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      authorized: false,
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    //TODO: create a new component authRequest.js and import it here and in tasklist
    event.preventDefault();
    const loginBody = { username: this.state.username, password: this.state.password }
    console.log(loginBody);

    axios
      .post("http://localhost:8000/tokens/obtain/", loginBody)
      .then((response) => {
        window.localStorage.setItem('access_token', response.data.access);
        console.log("access token123:", response.data.access);
        window.localStorage.setItem('refresh_token', response.data.refresh);
        console.log("refresh token123:", response.data.refresh);
        this.setState({ authorized: true })
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div>
        {!!localStorage.getItem('access_token') || this.state.authorized === true
          ? <Redirect to="/tasklist" />
          : null}
        <Navbar bg="dark" className="mb-3" /*fixed*/ sticky="top">
          <Container fluid="md">
            <Navbar.Brand className="text-white">deadlines</Navbar.Brand>
            <Nav>
              <Nav.Link className="text-white" as={NavLink} to='/' exact>Login</Nav.Link>
              <Nav.Link className="text-white" as={NavLink} to='/register' exact>Register</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Form onSubmit={this.handleSubmit}>
          <Container fluid>
            <Row className="justify-content-md-center mb-3">
              <Col xs="3">
                <Form.Control
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  placeholder="Enter your username:"
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center mb-3">
              <Col xs="3">
                <Form.Control
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  placeholder="Enter your password:"
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center mb-3">
              <Col xs="3">
                <Button variant="primary" type="submit">Login</Button>
              </Col>
            </Row>
          </Container>
        </Form >
        {/* <form className="Username" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Username:"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            type="password"
            placeholder="Password:"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          /><br />
          <button type="submit">Enter</button>
        </form> */}

        <Navbar bg="dark" fixed="bottom" >
          <Container fluid="md">
            <Navbar.Brand className="text-white">bottom text 2021</Navbar.Brand>
          </Container>
        </Navbar>
      </div >
    );
  }
}