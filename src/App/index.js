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
      selectedZip: 0,
      mapboxToken: "pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg",
      recentIncidents: "https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=50&$order=date%20DESC&$where=latitude%20IS%20NOT%20NULL",
    }
  }

  componentDidMount = () => {
    const token = localStorage.getItem("user-jwt");
    console.log(token);
    if (token) {
      this.onLogin;
      // this.setState({
      //   isLoggedIn: true,
      // });
      // console.log(this.state.isLoggedIn);
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

    const nypdApi = `https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=50&zip_code=${selectedZip}&$order=date%20DESC&$offset=0&$where=location%20IS%20NOT%20NULL`;

    this.setState({
      selectedZip: selectedZip,
      recentIncidents: nypdApi,
    });
  }

  render() {
    // console.log(this.state.recentIncidents);
    // console.log(this.state.selectedZip);
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