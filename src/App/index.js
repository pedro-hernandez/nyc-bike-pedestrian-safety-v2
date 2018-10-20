import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LandingPageMap from "../LandingPageMap";
import UserRegistration from "../UserRegistration";
import "./style.css";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user: {},
      username: "",
      password: "",
      isLoggedIn: false,
      bookmarks: [],
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
    })
  }

  fetchUser = async () => {
    const response = await fetch('/api/current-user/', {
      headers: {
        'jwt-token': localStorage.getItem('user-jwt')
      }
    });
    const user = await response.json();
    this.setState({
      user: user,
      bookmarks: user.bookmarks
    });
    console.log(this.state.user)
  }

  bookmarkIncident = async (ApiId, popupInfo) => {
    // console.log(popupInfo);
    await fetch(`/api/current-user`, {
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

    // this.setState(prevState => ({
    //   bookmarks: this.state.user.bookmarks
    // }));

    console.log(this.state.user.bookmarks);

    const incidentData = {
      apiId: popupInfo.unique_key,
      borough: popupInfo.borough,
      date: popupInfo.date,
      date: popupInfo.date,
      latitude: popupInfo.latitude,
      longitude: popupInfo.longitude,
      cyclistsInjured: popupInfo.number_of_cyclists_injured,
      cyclistsKilled: popupInfo.number_of_cyclists_killed,
      pedestriansInjured: popupInfo.number_of_pedestrians_injured,
      pedestriansKilled: popupInfo.number_of_pedestrians_killed,
      motoristsInjured: popupInfo.number_of_motorists_injured,
      motoristsKilled: popupInfo.number_of_motorists_killed,
      totalInjured: popupInfo.number_of_persons_injured,
      totalKilled: popupInfo.number_of_persons_killed
    }
    await fetch(`/api/create-incident/`, {
      method: 'POST',
      body: JSON.stringify(incidentData),
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('user-jwt')
      }
    });
  }

  removeIncident = async ApiId => {
    // console.log(ApiId);
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

    // this.setState(prevState => ({
    //   bookmarks: this.state.user.bookmarks
    // }));

    console.log(this.state.bookmarks);

    // console.log(this.state.user.id);
    await fetch(`/api/delete-bookmark/`, {
      method: 'DELETE',
      body: JSON.stringify({
        apiId: ApiId,
        userId: this.state.user.id,
      }),
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('user-jwt')
      }
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
                path="/"
                render={props =>
                  <LandingPageMap
                    {...props}
                    mapboxToken={this.state.mapboxToken}
                    onLogout={this.onLogout}
                    bookmarks={this.state.bookmarks}
                    bookmarkIncident={this.bookmarkIncident}
                    removeIncident={this.removeIncident}
                    user={this.state.user}
                    fetchUser={this.fetchUser} />
                }
              />
              : null
          }
        </div>
      </Router>
    </div>
  }
}



export default App;