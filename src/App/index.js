import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
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
      mapboxToken: "pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg",
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
    });
  }

  render() {
    return <div>
      <Router>
        <div>
          {!this.state.isLoggedIn ?
            <Route
              path="/"
              render={props =>
                <div>
                  <UserRegistration
                    {...props}
                    handleChange={this.handleChange}
                    onLogin={this.onLogin}
                    username={this.state.username}
                    password={this.state.password} />
                </div>
              }
            />
            : this.state.isLoggedIn ?
              <Route
                path="/home"
                render={props =>
                  <LandingPageMap
                    {...props}
                    mapboxToken={this.state.mapboxToken}
                    onLogout={this.onLogout}
                    bookmarks={this.state.bookmarks}
                    bookmarkIncident={this.bookmarkIncident}
                    removeBookmark={this.removeBookmark}
                    user={this.state.user}
                    fetchUser={this.fetchUser}
                    fetchBookmarks={this.fetchBookmarks}
                    mappedIncidents={this.state.mappedIncidents} />
                }/> : null }
        </div>
      </Router>
    </div>
  }
}

export default App;