import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LandingPageMap from "../LandingPageMap";
import UserRegistration from "../UserRegistration";
import "./style.css";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      zip: '',
      mapboxToken: "pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg",
      recentIncidents: "https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=50&$order=date%20DESC&$where=latitude%20IS%20NOT%20NULL",
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

  // fetchRecentIncidents = async () => {
  //   // collects incident data from API
  //   fetch(this.state.recentIncidents)
  //     .then(response => response.json())
  //     .then(incidents => {
  //       this.setState({
  //         incidents: incidents
  //       });
  //     });
  // }

  zipInfo = async (selectedZip) => {

    const nypdApi = `https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=50&zip_code=${selectedZip}&$order=date%20DESC&$offset=0&$where=location%20IS%20NOT%20NULL`;

    console.log(nypdApi)

    this.setState({
      recentIncidents: nypdApi,
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
                    mappedIncidents={this.state.mappedIncidents}
                    recentIncidents={this.state.recentIncidents}
                    fetchRecentIncidents={this.fetchRecentIncidents}
                    zipInfo={this.zipInfo} />
                } /> : null}
        </div>
      </Router>
    </div>
  }
}

export default App;