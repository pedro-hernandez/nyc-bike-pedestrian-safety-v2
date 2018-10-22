import React, { Component } from 'react';
import './style.css';


class BookmarkButton extends Component {

    bookmarkIncident = () => {
        this.props.bookmarkIncident(this.props.apiId, this.props.popupInfo);
    }

    removeBookmark = () => {
        this.props.removeBookmark(this.props.apiId);
    }

    render() {
        // console.log(this.props.bookmarks);
        // console.log(this.props.apiId);
        // console.log(typeof this.props.apiId)
    
        return (
            <div className="map-button">
                {(this.props.bookmarks === null || (!this.props.bookmarks.includes(parseInt(this.props.apiId)))) ?
                    <button className="bookmark-button" onClick={this.bookmarkIncident}>Bookmark</button>
                    : <button className="remove-button" onClick={this.removeBookmark}>Remove</button>
                }
            </div>
        )
    }
}

export default BookmarkButton;