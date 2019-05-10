import React, { Component } from 'react';
import moment from 'moment';
import Incident from "../Incident";

class UserBookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappedIncidents: [],
            value: '',
            key: 0,
            showIncident: false,
        }
    }

    render() {
        return (
            <div className="bookmarks">
                <h2 className="h2">Your Bookmarks</h2>
                <button className="bookmarks-button" onClick={this.props.fetchBookmarks}>Click to Retrieve or Refresh Your Bookmarks</button>
                <div className="bookmarks-list">
                    {this.props.mappedIncidents.map((item, index) => {
                        return (
                            <div className="incident" key={item.id} value={this.state.value}>
                                <div className="text-summary">
                                    {(item.totalInjured === 0 && item.totalKilled === 0) ? `No one was hurt ` : <span className="hurt">At least one person was hurt </span>}
                                    on {moment(item.date).format("dddd, MMMM Do YYYY")} {item.time ? `at ${moment(item.time, 'hh:mm a').format("hh:mm a")}` : ``} {this.props.borough && <span className="zip-span">} in zip code {item.zip_code}</span>}
                                </div>
                                <Incident item={item} showIncident={this.state.showIncident} removeBookmark={this.props.removeBookmark} mapboxToken={this.props.mapboxToken} popupInfo={this.props.popupInfo} fetchBookmarks={this.props.fetchBookmarks} />
                            </div>
                        );
                    })}
                    <div className="incident-trailing"></div>
                </div>
            </div>

        );
    }
}

export default UserBookmarks;