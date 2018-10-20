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
            incidents: [],
            popupInfo: null,
            viewport: {
                width: 798,
                height: 493,
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

        this.props.fetchUser();
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
                <BookmarkButton
                    popupInfo={this.state.popupInfo}
                    apiId={this.state.popupInfo.unique_key}
                    bookmarks={this.props.bookmarks}
                    bookmarkIncident={this.props.bookmarkIncident}
                    removeIncident={this.props.removeIncident}
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
                            <Link to="/" onClick={this.props.onLogout}>Logout</Link>
                        </div>
                    </div>
                </header>
                <main className="main">
                    <div className="main-map">
                        <h2 className="h2">50 Most Recent Accidents</h2>
                        <ReactMapGL className="map"
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
                    user={this.props.user}
                    fetchUser={this.props.fetchUser}
                    mapboxToken={this.props.mapboxToken}
                    removeIncident={this.props.removeIncident}
                    popupInfo={this.state.popupInfo}
                />
            </div>
        );
    }
}

export default LandingPageMap;
