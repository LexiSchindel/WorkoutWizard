import React, { Component } from "react";
 
class Users extends Component {

    // componentDidMount() {
    //     // Simple GET request using fetch
    //     fetch('http://localhost:5000/addUsers')
    //         .then(response => response.json())
    //         .then(data => this.setState({ totalReactPackages: data.total }));
    // }

    render() {
        return (
        <div>
            <h2>Users</h2>
            <p>Cras facilisis urna ornare ex volutpat, et
            convallis erat elementum. Ut aliquam, ipsum vitae
            gravida suscipit, metus dui bibendum est, eget rhoncus nibh
            metus nec massa. Maecenas hendrerit laoreet augue
            nec molestie. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus.</p>
    
            <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
        </div>
        );
    }
}
 
export default Users;