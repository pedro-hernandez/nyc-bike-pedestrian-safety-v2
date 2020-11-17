/* eslint-disable */

import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LandingPageMap from "../LandingPageMap";
import UserRegistration from "../UserRegistration";
import "./style.css";

const mapboxAPI = process.env.REACT_APP_MAPBOX_TOKEN;
const nycOpenAPI = process.env.REACT_APP_NYC_APP_TOKEN;

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      selectedZip: 0,
      mapboxToken: mapboxAPI,
      recentIncidents: 'https://data.cityofnewyork.us/resource/h9gi-nx95.json?$limit=50',
    }
  }

  componentDidMount = () => {
    const token = localStorage.getItem("user-jwt");
    console.log(token);
    if (token) {
      this.onLogin;
    }
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onLogin = () => {
    this.setState(prevState => ({
      isLoggedIn: !prevState.isLoggedIn,
    }));
    console.log(this.state.isLoggedIn);
  }

  onLogout = () => {
    localStorage.clear();

    this.setState(prevState => ({
      isLoggedIn: !prevState.isLoggedIn,
    }));
  }

  zipInfo = (selectedZip) => {

    const nypdApi = `https://data.cityofnewyork.us/resource/h9gi-nx95.json?$$app_token=${nycOpenAPI}&$limit=50&zip_code=${selectedZip}&$order=crash_date%20DESC&$offset=0&$where=location%20IS%20NOT%20NULL`;
    
    this.setState({
      selectedZip: selectedZip,
      recentIncidents: nypdApi,
    });
  }

  render() {
    return <div>
      < Router >
        <div>
          {(this.state.isLoggedIn === false) ?
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
            : (this.state.isLoggedIn === true) ?
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
                    mappedIncidents={this.state.mappedIncidents}
                    recentIncidents={this.state.recentIncidents}
                    zipInfo={this.zipInfo}
                    selectedZip={this.state.selectedZip} />
                } /> : null}
        </div>
      </Router >
    </div >
  }
}

export default App;