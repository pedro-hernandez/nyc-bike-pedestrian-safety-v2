import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';


class ZipView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            incidents: [],
            mappedIncidents: [],
            bookmarks: [],
            popupInfo: null,
            viewport: {
                width: 896,
                height: 552,
                latitude: 0,
                longitude: 0,
                zoom: 9.2,
                pitch: 50,
            }
        };
    }

    componentDidMount = () => {
        this.fetchRecentIncidents();
    }

    // componentDidUpdate = () => {
    //     this.props.recentIncidents;
    //     this.fetchRecentIncidents();
    // }

    fetchRecentIncidents = () => {

        console.log(this.props.recentIncidents)

        // collects incident data from API
        fetch(this.props.recentIncidents)
            .then(response => response.json())
            .then(incidents => {
                // console.log(incidents);
                this.setState({
                    incidents: [...incidents]
                });
            })
            .then(this.centerMap);


        // const latArray = this.state.incidents.map(a => a.location.coordinates[1]);
        // const lngArray = this.state.incidents.map(a => a.location.coordinates[0]);
        // const avgArray = array => array.reduce((a, b) => a + b, 0) / array.length;
        // let latAvg = parseFloat(avgArray(latArray));
        // let lngAvg = parseFloat(avgArray(lngArray));
        // console.log(latAvg);
        // console.log(lngAvg);
        // const viewport = {
        //     latitude: latAvg,
        //     longitude: lngAvg,
        //     zoom: 14,
        //     pitch: 50,
        // }

        // this.setState({
        //     viewport: { ...viewport }
        // });
    }

    centerMap = () => {
        console.log(this.state.incidents);
        const latArray = this.state.incidents.map(a => a.location.coordinates[1]);
        const lngArray = this.state.incidents.map(a => a.location.coordinates[0]);
        const avgArray = array => array.reduce((a, b) => a + b, 0) / array.length;
        let latAvg = parseFloat(avgArray(latArray));
        let lngAvg = parseFloat(avgArray(lngArray));
        console.log(latAvg);
        console.log(lngAvg);
        const viewport = {
            width: 896,
            height: 552,
            latitude: latAvg,
            longitude: lngAvg,
            zoom: 14,
            pitch: 50,
        }

        this.setState({
            viewport: { ...viewport }
        });
    }

    render = () => {
        const { viewport } = this.state;
        const incidents = this.state.incidents;
        return (
            <div>
                <ReactMapGL className="map-large"
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    mapboxApiAccessToken={this.props.mapboxToken}>
                    {incidents.map(this.props._renderMarker)}
                    {this.props._renderPopup()}
                </ReactMapGL>

            </div>
        )
    }
}

export default ZipView;