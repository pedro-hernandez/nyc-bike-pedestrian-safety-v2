import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import "./style.css";

class Map extends Component {
    state = {
        viewport: {
            width: this.props.width,
            height: this.props.height,
            latitude: parseFloat(this.props.latitude),
            longitude: parseFloat(this.props.longitude),
            zoom: 14,
            pitch: 45,
        }
    };

    render() {
        return (
            <div className="map">
            <ReactMapGL
                {...this.state.viewport}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onViewportChange={(viewport) => this.setState({ viewport })}
                mapboxApiAccessToken={mapboxToken} >
            <Marker latitude={parseFloat(this.props.latitude)} longitude={parseFloat(this.props.longitude)}>
            <div></div>
            </Marker>
            </ReactMapGL>
            </div>
        );
    }
}

export default Map;