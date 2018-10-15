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
      bookmarks: [],
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

  bookmarkIncident = async ApiId => {
    await fetch(`/api/current-user/`, {
        method: 'PUT',
        body: JSON.stringify({
            bookmarks: ApiId
        }),
        headers: {
            'Content-Type': 'application/json',
            'jwt-token': localStorage.getItem('user-jwt')
        }
    });
    await this.fetchUser();

    this.setState({
        bookmarks: this.state.user.bookmarks
    });
}

removeIncident = async ApiId => {
    await fetch(`/api/delete-item/`, {
        method: 'PUT',
        body: JSON.stringify({
            bookmarks: ApiId
        }),
        headers: {
            'Content-Type': 'application/json',
            'jwt-token': localStorage.getItem('user-jwt')
        }
    });
    await this.fetchUser();

    this.setState({
        favorites: this.state.user.bookmarks
    });

    console.log(this.state.bookmarks);
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
                    bookmarkIncident={this.bookmarkIncident}
                    removeIncident={this.removeIncident}
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
