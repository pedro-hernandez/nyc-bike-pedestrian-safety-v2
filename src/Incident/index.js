import React, { Component } from "react";
import Map from "../Map";
// import "./style.css"

class Incident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }

    }

    render() {
        return (
            <div>
                <Map latitude={this.props.item.latitude} longitude={this.props.item.longitude} width={600} height={371} mapboxToken={this.props.mapboxToken}
/>
                <div className="details">
                <ul className="details-list">
                {this.props.item.number_of_persons_injured > 0 && <li className="total-hurt-li"><span className="total-hurt">Total number of people hurt: {this.props.item.number_of_persons_injured}</span></li>}
                {this.props.item.number_of_persons_killed > 0 && <li className="hurt-li">People killed: {this.props.item.number_of_persons_killed}</li>}
                {this.props.item.number_of_cyclists_injured > 0 && <li className="hurt-li">Cyclists hurt: {this.props.item.number_of_cyclists_injured}</li>}
                {this.props.item.number_of_cyclist_killed > 0 && <li className="hurt-li">Cyclists killed: {this.props.item.number_of_cyclist_killed}</li>}
                {this.props.item.number_of_pedestrians_injured > 0 && <li className="hurt-li">Pedestrians hurt: {this.props.item.number_of_pedestrians_injured}</li>}
                {this.props.item.number_of_pedestrians_killed > 0 && <li className="hurt-li">Pedestrians killed: {this.props.item.number_of_pedestrians_killed}</li>}
                {this.props.item.number_of_motorist_injured > 0 && <li className="hurt-li">Motorists hurt: {this.props.item.number_of_motorist_injured}</li>}
                {this.props.item.number_of_motorist_killed > 0 && <li className="hurt-li">Motorists killed: {this.props.item.number_of_motorist_killed}</li>}
                </ul>
                </div>
            </div>
        )
    }
}

export default Incident;