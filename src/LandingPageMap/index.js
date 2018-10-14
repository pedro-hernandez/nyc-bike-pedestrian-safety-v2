import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import MarkerPin from '../MarkerPin';
import './style.css';


const mapboxToken = 'pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg';

// 20 most recent incidents from the NYC Open Data / NYPD Motor Vehicle Collisions API
const recentIncidents = 'https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=10&$where=latitude%20IS%20NOT%20NULL';


class LandingPageMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            incidents: [],
            popupInfo: null,
            viewport: {
                width: 1200,
                height: 800,
                latitude: 40.7454474,
                longitude: -73.9711897,
                zoom: 11,
                pitch: 45,
            }
        };
    }

    componentDidMount() {

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

        // const incidentData = incident;
        // console.log(incidentData);

        return (
            <Marker key={index}
                longitude={lng}
                latitude={lat}
                captureClick={true}>
                <MarkerPin size={20} onClick={(prevState) => this.setState({popupInfo: incident})} />
            </Marker>

        );
    }

    _renderPopup = () => {

        // const lat = parseFloat(incident.location.coordinates[1]);
        // const lng = parseFloat(incident.location.coordinates[0]);

        const {popupInfo} = this.state;

        return popupInfo && (
            <Popup
                // key={i}
                tipSize={5}
                anchor="bottom"
                longitude={parseFloat(popupInfo.longitude)}
                latitude={parseFloat(popupInfo.latitude)}
                closeButton={true}
                captureClick={true}
                onClose={() => this.setState({ popupInfo: null })}
                offset={25} >
                <div>{`${popupInfo.borough}`}</div>
            </Popup>
        );
    }


    render = () => {
        const {viewport} = this.state;
        const incidents = this.state.incidents;
        return (
            <div>
                <ReactMapGL className="map"
                    {...viewport}
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    mapboxApiAccessToken={mapboxToken}
                >
                    {incidents.map(this._renderMarker)}
                    {this._renderPopup()}
                </ReactMapGL>
            </div>
        );
    }
}

export default LandingPageMap;
