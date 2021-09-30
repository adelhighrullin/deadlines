import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: '',
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
    const loginBody = { username: this.state.login, password: this.state.password }
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
        <p>deadlines</p>
        <form className="Login" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Login:"
            name="login"
            value={this.state.login}
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
        </form>
        <p>Don't have an account yet? <Link to="/register">Register now.</Link></p>
      </div>
    );
  }
}