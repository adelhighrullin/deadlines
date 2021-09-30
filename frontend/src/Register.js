import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      <div className="Register">
        
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Email:" name="email" value={this.state.email} onChange={this.handleChange}/>
          <input type="text" placeholder="Username:" name="username" value={this.state.username} onChange={this.handleChange}/>
          <input type="password" placeholder="Password:" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
          <button type="submit">Register</button>
        </form>
        <p>register page</p>
        <p>Already have an account? <Link to="/">Login.</Link></p>
      </div>
    );
  }
}