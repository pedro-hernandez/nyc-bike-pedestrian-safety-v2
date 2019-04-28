import React, { Component } from 'react'

class ZipCodeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    handleChange = (event) => {
        this.setState({
            value: event.target.value,
        })
    }

    handleSubmit = (event) => {
        let selectedZip = `${this.state.value}`;
        this.props.zipInfo(selectedZip);
        event.preventDefault();
        this.setState({
            value: '',
        })
    }

    render() {
        // zip code input field
        return (
            <div className="zip-form">
                <form onSubmit = {this.handleSubmit}>
                <label className="label">
                    Enter a valid, five-digit NYC zip code:
                    <input className="zip-input" type="text" value = {this.state.value} onChange={this.handleChange} />
                </label>
                <button className="zip-submit-button" type="Submit">Submit</button>
                </form>

            </div>
        )
    }
}

export default ZipCodeSelect;