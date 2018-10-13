import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import './style.css';


const mapboxToken = 'pk.eyJ1IjoicGhlcm4iLCJhIjoiY2psc2JlN3lnMDBiaTNwcGhyaWlpa2VldCJ9.665bVWc7nQRX882OxrIaNg';

// 20 most recent incidents from the NYC Open Data / NYPD Motor Vehicle Collisions API
const recentIncidents = 'https://data.cityofnewyork.us/resource/qiz3-axqb.json?$$app_token=vsw3d1IWA34wIGA56fGGb4DIc&$limit=20&$where=latitude%20IS%20NOT%20NULL';


class LandingPageMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            incidents: [],
            viewport: {
                width: 800,
                height: 400,
                latitude: 40.7398476,
                longitude: -73.9924008,
                zoom: 9,
                pitch: 45
            }
        }
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

    _renderMarker(incident, i) {
        const lat = parseFloat(incident.location.coordinates[1]);
        const lng = parseFloat(incident.location.coordinates[0]);
        const date = incident.date;

        return (
            <Marker key={i} longitude={lng} latitude={lat}/>
        )
    }


    render() {
        const { viewport } = this.state;
        const incidents = this.state.incidents;
        return (
            <div>
                <ReactMapGL className="map"
                {...viewport}
                mapStyle="mapbox://styles/mapbox/light-v9"
                // onViewportChange={(viewport) => this.setState({viewport})}
                mapboxApiAccessToken={mapboxToken}
                >
                { incidents.map(this._renderMarker) }
                </ReactMapGL>
            </div>
        );
    }
}

export default LandingPageMap;
