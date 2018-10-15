import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LandingPageMap from "../LandingPageMap";
import UserRegistration from "../UserRegistration";
import "./style.css";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
    }
  }

  componentDidMount = () => {
    const token = localStorage.getItem("user-jwt");
    if (token) {
      this.setState({
        isLoggedIn: true,
      });
    }
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onLogin = () => {
    this.setState({
      isLoggedIn: true,
    });
  }

  onLogout = () => {
    localStorage.clear();
    
    this.setState({
      isLoggedIn: false,
    })
  }

  fetchUser = async () => {
    const response = await fetch('/api/current-user', {
        headers: {
            'jwt-token': localStorage.getItem('user-jwt')
        }
    });
    const user = await response.json();
    this.setState({
        user: user
    });
}

  render() {
    return <div className="App">
    <Router>
        <div className="app">
          {!this.state.isLoggedIn ?
            <Route
              path="/"
              render={props =>
                <UserRegistration
                  {...props}
                  handleChange={this.handleChange}
                  onLogin={this.onLogin}
                  username={this.state.username}
                  password={this.state.password}
                />
              }
            />
            : this.state.isLoggedIn ?
              <Route
                path="/"
                render={props =>
                  <LandingPageMap
                    {...props}
                    onLogout={this.onLogout}
                  />
                }
              />
              : null
          }
        </div>
      </Router>
    {/* <LandingPageMap /> */}
    </div>
  }
}



export default App;
