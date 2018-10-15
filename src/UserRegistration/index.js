import React, { Component } from 'react'

class UserRegistration extends Component {
    handleChange = event => {
        this.props.handleChange(event);
    }

    onFormSubmit = event => {
        event.preventDefault();
    }

    register = async () => {
        if (this.props.username === "" || this.props.password === "") {
            alert("Please enter a valid username or password.");
            return;
        };
        const requestBody = JSON.stringify({
            username: this.props.username,
            password: this.props.password,
        });
        const response = await fetch('/api/register', {
            method: 'POST',
            body: requestBody,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseBody = await response.json();
        if (response.status === 409 || responseBody === undefined) {
            alert("This username already exists, please select another username.")
            return;
        }
        this.props.onLogin();
        localStorage.setItem('user-jwt', responseBody);
        this.props.history.push("/");
    }

    logIn = async () => {
        if (this.props.username === "" || this.props.password === "") {
            alert("Please enter a valid username or password.");
            return;
        };

        const requestBody = JSON.stringify({
            username: this.props.username,
            password: this.props.password,
        });

        const response = await fetch('/api/login', {
            method: 'POST',
            body: requestBody,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseBody = await response.json();

        if (response.status === 401) {
            this.setState({
                errorMessage: responseBody.message
            });
            return;
        }
        this.props.onLogin();
        localStorage.setItem('user-jwt', JSON.stringify(responseBody))
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="form">
                <form onSubmit={this.onFormSubmit}>
                <div>Log in to view your bookmarked accidents. Not a member? Register below!</div>
                    <input type="text" name="username" placeholder="username" onChange={this.handleChange} />
                    <input type="password" name="password" placeholder="password" onChange={this.handleChange} />
                    <input type="text" name="email" placeholder="email optional" onChange={this.handleChange} /><br></br>
                    <button type="button" onClick={this.register}>Register</button>
                    <button type="button" onClick={this.logIn}>Login</button>
                </form>
            </div>
        );
    }
}
export default UserRegistration;
