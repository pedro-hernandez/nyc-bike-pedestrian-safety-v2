import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import MarkerPin from '../MarkerPin';
import "./style.css";


// base, per-incident  mapping component for informational views and user bookmarks

class Map extends Component {
    state = {
        viewport: {
            width: this.props.width,
            height: this.props.height,
            latitude: parseFloat(this.props.latitude),
            longitude: parseFloat(this.props.longitude),
            zoom: 16,
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
                mapboxApiAccessToken={this.props.mapboxToken} >
            <Marker latitude={parseFloat(this.props.latitude)} longitude={parseFloat(this.props.longitude)}>
            <MarkerPin size={20} />
            </Marker>
            </ReactMapGL>
            </div>
        );
    }
}

export default Map;