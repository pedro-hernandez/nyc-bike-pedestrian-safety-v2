import React, { Component } from 'react';
import './style.css';

class UserBookmarks extends Component {
    constructor(props) {
        super(props);
        this.state ={
            bookmarksFromDb: [],
        }
    }
    

fetchBookmarks = async () => {
    let bookmarksFromDb;
    try {
        const response = await fetch('/api/bookmarks');
        bookmarksFromDb = await response.json();
    } catch (error) {
        alert(error);
    }
    this.setState({
        bookmarksFromDb: bookmarksFromDb
    });
    console.log(bookmarksFromDb)

}

    render() {
        return (
            <div>
                <button onClick={this.fetchBookmarks}>FETCH BOOKMARKS</button>
            </div>
        );
    }
}

export default UserBookmarks;