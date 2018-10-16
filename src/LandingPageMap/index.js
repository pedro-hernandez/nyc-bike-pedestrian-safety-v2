import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import MarkerPin from '../MarkerPin';
import BookmarkButton from '../BookmarkButton';
import './style.css';
// import { runInThisContext } from 'vm';


// const mapboxToken = 'pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg';

// 20 most recent incidents from the NYC Open Data / NYPD Motor Vehicle Collisions API
const recentIncidents = 'https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=30&$where=latitude%20IS%20NOT%20NULL';


class LandingPageMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            incidents: [],
            popupInfo: null,
            viewport: {
                width: 800,
                height: 600,
                latitude: 40.7454474,
                longitude: -73.9711897,
                zoom: 11,
                pitch: 45,
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
    }

    _renderMarker = (incident, index) => {
        const lat = parseFloat(incident.location.coordinates[1]);
        const lng = parseFloat(incident.location.coordinates[0]);

        return (
            <Marker key={index}
                longitude={lng}
                latitude={lat}
                captureClick={true}>
                <MarkerPin size={20} onClick={(prevState) => this.setState({popupInfo: incident})} />
            </Marker>

        );
    }

    // mapbox popups adapted from react-map-gl docs
    // https://github.com/uber/react-map-gl/tree/3.2-release/examples/controls

    _renderPopup = () => {

        const {popupInfo} = this.state;

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
                apiId={popupInfo.unique_key}
                bookmarks={this.props.bookmarks}
                bookmarkIncident={this.props.bookmarkIncident}
                removeIncident={this.props.removeIncident}
                 />
            </Popup>
        );
    }


    render = () => {
        const {viewport} = this.state;
        const incidents = this.state.incidents;
        return (
            <div>
                <p>20 Most Recent Accidents</p>
                <ReactMapGL className="map"
                    {...viewport}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    mapboxApiAccessToken={this.props.mapboxToken}
                >
                    {incidents.map(this._renderMarker)}
                    {this._renderPopup()}
                </ReactMapGL>
            </div>
        );
    }
}

export default LandingPageMap;
