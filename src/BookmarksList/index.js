import React, { Component } from "react";
import moment from "moment";
import Bookmark from "../Bookmark";
import "./style.css";

class BookmarkList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            key: 0,
            showIncident: false,
            coordsObj: {},
        }
    }



    render() {
        return (
            <div className="incidents_wrapper">
                {this.props.incidents.map((item, index) => {
                    return (
                        <div className="incident" key={item.unique_key} value={this.state.value}>
                            <div className="text-summary">
                                {(parseInt(item.number_of_persons_injured, 10) === 0 && parseInt(item.number_of_persons_killed, 10) === 0) ? `No one was hurt ` : <span className="hurt">At least one person was hurt </span>}
                                on {moment(item.date).format("dddd, MMMM Do YYYY")} at {moment(item.time, 'hh:mm a').format("hh:mm a")}{this.props.borough && <span className="zip-span"> in zip code {item.zip_code}</span>}
                            </div>
                            <Incident item={item} showIncident={this.state.showIncident} />
                        </div>
                    );
                })
                }
            </div>
        );
    }
}

export default BookmarkList;