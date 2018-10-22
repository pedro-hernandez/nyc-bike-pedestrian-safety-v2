import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import MarkerPin from '../MarkerPin';
import BookmarkButton from '../BookmarkButton';
import UserBookmarks from '../UserBookmarks'
import { Link } from 'react-router-dom';
import './style.css';
// import { runInThisContext } from 'vm';


// const mapboxToken = 'pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg';

// 20 most recent incidents from the NYC Open Data / NYPD Motor Vehicle Collisions API
const recentIncidents = 'https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=50&$order=date%20DESC&$where=latitude%20IS%20NOT%20NULL';


class LandingPageMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            incidents: [],
            mappedIncidents: [],
            bookmarks: [],
            popupInfo: null,
            viewport: {
                width: 896,
                height: 552,
                latitude: 40.7126,
                longitude: -73.9005,
                zoom: 9.2,
                pitch: 50,
            }
        };
    }

    componentDidMount = () => {

        // collects incidident data from API
        fetch(recentIncidents)
            .then(response => response.json())
            .then(incidents => {
                this.setState({
                    incidents: incidents
                });
            });

        this.fetchUser();
    }

    fetchUser = async () => {
        const response = await fetch('/api/current-user/', {
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });
        const user = await response.json();
        this.setState(prevState => ({
            user: user,
            bookmarks: user.bookmarks
        }));
        console.log(this.state.user)
        // console.log(this.state.bookmarks)

    }

    bookmarkIncident = async (apiUniqueKey, popupInfo) => {
        // console.log(popupInfo);
        await fetch(`/api/current-user`, {
            method: 'PUT',
            body: JSON.stringify({
                bookmarks: apiUniqueKey
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

        // console.log(this.state.user.bookmarks);

        const incidentData = {
            apiId: popupInfo.unique_key,
            borough: popupInfo.borough,
            date: popupInfo.date,
            time: popupInfo.time,
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
        // window.location.reload();
    }

    removeBookmark = async apiUniqueKey => {
        console.log(apiUniqueKey);
        console.log(typeof(apiUniqueKey));
        console.log(this.state.user.id);
        await fetch(`/api/delete-item/`, {
            method: 'PUT',
            body: JSON.stringify({
                bookmarks: apiUniqueKey
            }),
            headers: {
                'Content-Type': 'application/json',
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });
        await this.fetchUser();

        this.setState(prevState => ({
          bookmarks: this.state.user.bookmarks
        }));

        // console.log(this.state.bookmarks);

        // console.log(this.state.user.id);
        await fetch(`/api/delete-bookmark/`, {
            method: 'DELETE',
            body: JSON.stringify({
                apiId: apiUniqueKey,
                userId: this.state.user.id,
            }),
            headers: {
                'Content-Type': 'application/json',
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });
    }

    fetchBookmarks = async () => {
        let userId = this.state.user.id;
        console.log(userId);
        let incidents = [];
        try {
            const response = await fetch(`/api/bookmarks/${userId}`);
            incidents = await response.json();
        } catch (error) {
            alert(error);
        }
        this.setState(prevState => ({
            mappedIncidents: incidents
        }));
        // console.log(this.state.mappedIncidents);
    }

    onLogout = () => {
        this.props.onLogout();
    }

    removeUser = async () => {
        await fetch(`/api/delete-user/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });
        this.props.onLogout();
        this.props.history.push('/');
    }

    _renderMarker = (incident, index) => {
        const lat = parseFloat(incident.location.coordinates[1]);
        const lng = parseFloat(incident.location.coordinates[0]);

        return (
            <Marker key={index}
                longitude={lng}
                latitude={lat}
                captureClick={true}>
                <MarkerPin size={20} onClick={(prevState) => this.setState({ popupInfo: incident })} />
            </Marker>

        );
    }

    // mapbox popups adapted from react-map-gl docs
    // https://github.com/uber/react-map-gl/tree/3.2-release/examples/controls

    _renderPopup = () => {

        const { popupInfo } = this.state;

        return popupInfo && (
            <Popup
                tipSize={5}
                anchor="top"
                longitude={parseFloat(popupInfo.longitude)}
                latitude={parseFloat(popupInfo.latitude)}
                closeButton={true}
                captureClick={true}
                onClose={() => this.setState({ popupInfo: null })}>
                <div className="popup-container">
                    {`People injured: ${popupInfo.number_of_persons_injured}`}
                    <br />
                    {`People killed: ${popupInfo.number_of_persons_killed}`}
                </div>
                <BookmarkButton className="popup-button"
                    popupInfo={this.state.popupInfo}
                    apiId={this.state.popupInfo.unique_key}
                    bookmarks={this.state.bookmarks}
                    bookmarkIncident={this.bookmarkIncident}
                    removeBookmark={this.removeBookmark}
                    mapboxToken={this.props.mapboxToken}
                />
            </Popup>
        );
    }


    render = () => {
        // console.log(this.props.user.id);
        const { viewport } = this.state;
        const incidents = this.state.incidents;
        return (
            <div>
                <header className="header">
                    <div className="header-wrapper">
                        <div>
                            <h1 className="h1">NYC Bike and Pedestrian Safety App v.2 🚴‍🚶‍</h1>
                        </div>
                        <div className="logout-button">
                            <Link to="/" onClick={this.onLogout}>Logout</Link>
                        </div>
                    </div>
                </header>
                <main className="main">
                    <div className="main-map">
                        <h2 className="h2">50 Most Recent Accidents</h2>
                        <ReactMapGL className="map-large"
                            {...viewport}
                            onViewportChange={(viewport) => this.setState({ viewport })}
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                            mapboxApiAccessToken={this.props.mapboxToken}>
                            {incidents.map(this._renderMarker)}
                            {this._renderPopup()}
                        </ReactMapGL>
                    </div>
                </main>
                <UserBookmarks
                    user={this.state.user}
                    fetchUser={this.fetchUser}
                    mapboxToken={this.props.mapboxToken}
                    removeBookmark={this.removeBookmark}
                    popupInfo={this.state.popupInfo}
                    fetchBookmarks={this.fetchBookmarks}
                    mappedIncidents={this.state.mappedIncidents} />
            </div>
        );
    }
}

export default LandingPageMap;
