import React, { Component } from 'react';

class BookmarkButton extends Component {

    bookmarkIncident = () => {
        this.props.bookmarkIncident(this.props.apiId, this.props.popupInfo);
    }

    removeBookmark = () => {
        this.props.removeBookmark(this.props.apiId);
    }

    render() {
    
        return (
            <div className="map-button">
                {(this.props.bookmarks === null || (!this.props.bookmarks.includes(parseInt(this.props.apiId), 10))) ?
                    <button className="bookmark-button" onClick={this.bookmarkIncident}>Bookmark</button>
                    : <button className="remove-button" onClick={this.removeBookmark}>Remove</button>
                }
            </div>
        )
    }
}

export default BookmarkButton;