import React, { Component } from 'react';
import './style.css';


class BookmarkButton extends Component {

    toggleDetails = () => {
        this.props.toggleDetails(this.props.apiId);
      }
    
      bookmarkIncident = () => {
        this.props.bookmarkIncident(this.props.apiId);
      }
    
      removeIncident = () => {
        this.props.removeIncident(this.props.apiId);
      }

    render() {
        console.log(this.props.apiId);
        return (
            <div className="map-buttons">
                {!this.props.bookmarks.includes(this.props.apiId) ?
                    <button className="bookmark-button" onClick={this.bookmarkIncident}>Bookmark</button>
                    : <button className="remove-button" onClick={this.removeIncident}>Remove</button>
                }
            </div>
        )
    }
}

export default BookmarkButton;