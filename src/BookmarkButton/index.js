import React, { Component } from 'react';
import './style.css';


class BookmarkButton extends Component {

    toggleDetails = () => {
        this.props.toggleDetails(this.props.apiId);
      }
    
      favoriteCharacter = () => {
        this.props.bookmarkIncident(this.props.apiId);
      }
    
      removeCharacter = () => {
        this.props.removeIncident(this.props.apiId);
      }

    render() {
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