import React, { Component } from 'react';
import moment from "moment";
import Incident from "../Incident";
import './style.css';

class UserBookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappedIncidents: [],
            // bookmarksFromDb: [],
            value: '',
            key: 0,
            showIncident: false,
        }
    }

    componentDidMount = () => {
        this.props.fetchUser();
    }

    fetchBookmarks = async () => {
        let userId = this.props.user.id;
        console.log(userId);
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
        // console.log(this.state.mappedIncidents);
    }

    render() {
        return (
            <div className="bookmarks">
                <button className="bookmarks-button" onClick={this.fetchBookmarks}>Click to Retrieve or Refresh Your Bookmarks</button>
                <div className="bookmarks-list">
                    {this.state.mappedIncidents.map((item, index) => {
                        return (
                            <div className="incident" key={item.id} value={this.state.value}>
                                <div className="text-summary">
                                    {(item.totalInjured === 0 && item.totalKilled === 0) ? `No one was hurt ` : <span className="hurt">At least one person was hurt </span>}
                                    on {moment(item.date).format("dddd, MMMM Do YYYY")} {item.time ? `at {moment(item.time, 'hh:mm a').format("hh:mm a")}` : ``} {this.props.borough && <span className="zip-span">} in zip code {item.zip_code}</span>}
                                </div>
                                <Incident item={item} showIncident={this.state.showIncident} removeIncident={this.props.removeIncident} mapboxToken={this.props.mapboxToken} popupInfo={this.props.popupInfo} fetchBookmarks={this.fetchBookmarks} />
                            </div>
                        );
                    })
                    }
                    <div className="incident-trailing"></div>
                </div>
            </div>

        );
    }
}

export default UserBookmarks;