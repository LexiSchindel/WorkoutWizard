import React, { Component } from "react";
 
class Exercises extends Component {

    // componentDidMount() {
        // Simple GET request using fetch
    //     fetch('http://localhost:5000/getData/')
    //         .then(response => response.json())
    //         .then(data => this.setState({ totalReactPackages: data.total }));
    // }

    render() {
        return (
        <div>
            <h2>Exercises</h2>
            <p>Mauris sem velit, vehicula eget sodales vitae,
            rhoncus eget sapien:</p>
            <ol>
            <li>Nulla pulvinar diam</li>
            <li>Facilisis bibendum</li>
            <li>Vestibulum vulputate</li>
            <li>Eget erat</li>
            <li>Id porttitor</li>
            </ol>
        </div>
        );
    }
}
 
export default Exercises;