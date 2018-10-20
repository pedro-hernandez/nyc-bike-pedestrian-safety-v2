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

    removeIncident = () => {
        this.props.removeIncident(this.props.item.apiId);
    }

    handleClick = () => {
        this.removeIncident();
        this.props.fetchBookmarks();
    }

    render() {
        // console.log(this.props.item);
        return (
            <div>
                <Map latitude={this.props.item.latitude} longitude={this.props.item.longitude} width={600} height={371} mapboxToken={this.props.mapboxToken}
/>
                <div className="details">
                <button className="remove-button" onClick={this.handleClick}>Remove This Bookmark</button>
                <ul className="details-list">
                {this.props.item.totalInjured > 0 && <li className="total-hurt-li"><span className="total-hurt">Total number of people hurt: {this.props.item.totalInjured}</span></li>}
                {this.props.item.totalKilled > 0 && <li className="hurt-li">People killed: {this.props.item.totalkilled}</li>}
                {this.props.item.cyclistsInjured > 0 && <li className="hurt-li">Cyclists hurt: {this.props.item.cyclistsInjured}</li>}
                {this.props.item.cyclistKilled > 0 && <li className="hurt-li">Cyclists killed: {this.props.item.cyclistKilled}</li>}
                {this.props.item.pedestriansInjured > 0 && <li className="hurt-li">Pedestrians hurt: {this.props.item.pedestriansInjured}</li>}
                {this.props.item.pedestriansKilled > 0 && <li className="hurt-li">Pedestrians killed: {this.props.item.pedestriansKilled}</li>}
                {this.props.item.motoristInjured > 0 && <li className="hurt-li">Motorists hurt: {this.props.item.motoristInjured}</li>}
                {this.props.item.motoristKilled > 0 && <li className="hurt-li">Motorists killed: {this.props.item.motoristKilled}</li>}
                </ul>
                </div>
            </div>
        )
    }
}

export default Incident;