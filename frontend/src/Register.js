import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

import { Button, Container, Col, Form, Nav, Navbar, Row } from 'react-bootstrap'

export default class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      created: false,
      email: "",
      username: "",
      password: "",
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const inputForm = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    }
    axios
      .post('http://localhost:8000/register/', inputForm)
      .then(console.log('made post request'))
      .then((response) => console.log(response))
      .catch((err) => console.log(err))
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" className="mb-3" /*fixed*/ sticky="top">
          <Container fluid="md">
            <Navbar.Brand className="text-white">deadlines</Navbar.Brand>
            <Nav>
              <Nav.Link className="text-white" as={NavLink} to='/' exact>Login</Nav.Link>
              <Nav.Link className="text-white" as={NavLink} to='/register' exact>Register</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <h1 style={{textAlign: "center"}}>Register</h1>
        <Form onSubmit={this.handleSubmit}>
          <Container fluid>
            <Row className="justify-content-md-center mb-3">
              <Col xs="3">
                <Form.Control
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  placeholder="Enter your email:"
                />
              </Col>
            </Row>
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
                <Button variant="primary" type="submit">Register</Button>
              </Col>
            </Row>
          </Container>
        </Form>
        <Navbar bg="dark" fixed="bottom">
          <Container fluid="md">
            <Navbar.Brand className="text-white">bottom text 2021</Navbar.Brand>
          </Container>
        </Navbar>
        {/* <h1>deadlines</h1>
        <form className="Register" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Email:" name="email" value={this.state.email} onChange={this.handleChange}/>
          <input type="text" placeholder="Username:" name="username" value={this.state.username} onChange={this.handleChange}/>
          <input type="password" placeholder="Password:" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/">Login.</Link></p> */}
      </div>
    );
  }
}