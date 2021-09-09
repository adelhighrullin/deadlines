import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
      })
      .catch((err) => console.log(err));

    this.setState({ authorized: true });
  }

  handleLogOut = () => {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
    this.setState({ authorized: false });
  }

  render() {
    return (
      <div>
        <p>this is login page</p>
        <Link to="/tasklist">Go to TaskList</Link>
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
        {this.state.authorized ?
          <button onClick={this.handleLogOut}>Log out</button>
          : null
        }
      </div>
    );
  }
}