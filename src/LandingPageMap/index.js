import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import MarkerPin from '../MarkerPin';
import moment from 'moment'
import BookmarkButton from '../BookmarkButton';
import UserBookmarks from '../UserBookmarks'
import ZipCodeSelect from '../ZipCodeSelect';
import ZipView from '../ZipView';
import { Link } from 'react-router-dom';

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
        this.fetchUser();
    }

    componentDidUpdate = () => {
        this.fetchRecentIncidents();
    }

    fetchRecentIncidents = () => {
        // collects incident data from API
        fetch(this.props.recentIncidents)
            .then(response => response.json())
            .then(incidents =>
                // console.log(incidents))
                {
                this.setState({
                    incidents: [...incidents]
                });
            });
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
    }

    bookmarkIncident = async (apiUniqueKey, popupInfo) => {
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

        const incidentData = {
            apiId: popupInfo.collision_id,
            borough: popupInfo.borough,
            date: popupInfo.crash_date,
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

        this.fetchBookmarks();
    }

    removeBookmark = async apiUniqueKey => {
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

        this.fetchBookmarks();
    }

    fetchBookmarks = async () => {
        let userId = this.state.user.id;
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
        // console.log(incident.latitude);
        const lat = parseFloat(incident.latitude);
        const lng = parseFloat(incident.longitude);

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
                    {`Date: ${moment(popupInfo.crash_date).format("dddd, MMMM Do YYYY")}`}
                    <br />
                    {`People injured: ${popupInfo.number_of_persons_injured}`}
                    <br />
                    {`People killed: ${popupInfo.number_of_persons_killed}`}
                </div>
                <BookmarkButton className="popup-button"
                    popupInfo={this.state.popupInfo}
                    apiId={this.state.popupInfo.collision_id}
                    bookmarks={this.state.bookmarks}
                    bookmarkIncident={this.bookmarkIncident}
                    removeBookmark={this.removeBookmark}
                    mapboxToken={this.props.mapboxToken}
                />
            </Popup>
        );
    }

    render = () => {
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

                        <div className="account-delete-button">
                            <Link to="/" onClick={this.removeUser}>Delete Your Account</Link>
                        </div>

                    </div>
                </header>
                <main className="main">
                    <div className="main-map">
                        {(this.props.selectedZip === 0) ?
                            <div>
                                <h2 className="h2">50 Most Recent Accidents in NYC</h2>
                                <ReactMapGL className="map-large"
                                    {...viewport}
                                    onViewportChange={(viewport) => this.setState({ viewport })}
                                    mapStyle="mapbox://styles/mapbox/streets-v10"
                                    mapboxApiAccessToken={this.props.mapboxToken}>
                                    {incidents.map(this._renderMarker)}
                                    {this._renderPopup()}
                                </ReactMapGL>
                        <ZipCodeSelect zipInfo={this.props.zipInfo} />
                            </div>
                            :
                            <div>
                                <h2 className="h2">50 Most Recent Accidents in {this.props.selectedZip}</h2>
                                <ZipView recentIncidents={this.props.recentIncidents}
                                    mapboxToken={this.props.mapboxToken}
                                    _renderMarker={this._renderMarker}
                                    _renderPopup={this._renderPopup}
                                />
                                ...or view accidents in another neighborhood.
                        <ZipCodeSelect zipInfo={this.props.zipInfo} />
                            </div>
                        }
                    </div>
                </main>
                <UserBookmarks
                    user={this.state.user}
                    fetchUser={this.fetchUser}
                    mapboxToken={this.props.mapboxToken}
                    removeBookmark={this.removeBookmark}
                    popupInfo={this.state.popupInfo}
                    fetchBookmarks={this.fetchBookmarks}
                    fetchRecentIncidents={this.fetchRecentIncidents}
                    mappedIncidents={this.state.mappedIncidents} />
            </div>
        );
    }
}

export default LandingPageMap;