import React, { Component } from 'react';
import './style.css';

class UserBookmarks extends Component {
    constructor(props) {
        super(props);
        this.state ={
            bookmarksFromDb: [],
        }
    }

    componentDidMount = () => {
        this.props.fetchUser();
    }
    
    

fetchBookmarks = async () => {
    let userId = this.props.userId;
    console.log(userId);
    let bookmarksFromDb;
    try {
        const response = await fetch(`/api/bookmarks/${userId}`);
        bookmarksFromDb = await response.json();
    } catch (error) {
        alert(error);
    }
    this.setState({
        bookmarksFromDb: bookmarksFromDb
    });
    console.log(bookmarksFromDb);
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