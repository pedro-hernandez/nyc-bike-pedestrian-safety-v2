import React, { Component } from 'react';
import './style.css';


class BookmarkButton extends Component {

    bookmarkIncident = () => {
        this.props.bookmarkIncident(this.props.apiId, this.props.popupInfo);
    }

    removeIncident = () => {
        this.props.removeIncident(this.props.apiId);
    }

    render() {
        console.log(this.props.bookmarks);
        console.log(this.props.apiId);
        // console.log(typeof this.props.apiId)
    
        return (
            <div className="map-buttons">
                {!this.props.bookmarks.includes(parseInt(this.props.apiId)) ?
                    <button className="bookmark-button" onClick={this.bookmarkIncident}>Bookmark</button>
                    : <button className="remove-button" onClick={this.removeIncident}>Remove</button>
                }
            </div>
        )
    }
}

export default BookmarkButton;