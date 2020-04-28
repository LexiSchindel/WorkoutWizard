import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
 
class Users extends Component {

	// componentDidMount() {
    //     // Simple GET request using fetch
    //     fetch('http://localhost:5000/addUsers')
    //         .then(response => response.json())
    //         .then(data => this.setState({ totalReactPackages: data.total }));
    // }

    state = {
        isLoading: true,
        data: [],
        error: null
      }

    componentDidMount() {
        // Simple GET request using fetch
        fetch('/getTable?table=Users')
        .then((response) => {
            return response.json();
          })
          .then(data =>
            this.setState({
              data: data,
              isLoading: false,
            })
          )
        // Catch any errors we hit and update the app
        .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { isLoading, data, error } = this.state;

        return (
        <div>
            <Container>
            <br />
                <Row>
                    <div>
                        <p>A list of all gym employees with access to the website.
                            Add a user if someone new needs to create or view workouts.
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form>
                        <Form.Label>Add User</Form.Label>

                        <Form.Row>
                        <Form.Group as={Col} controlId="usersFirstName">
                            {/* <Form.Label>Add User</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="userName"
                            placeholder="First name" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="userLastName">
                            {/* <Form.Label>Last Name</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="userName"
                            placeholder="Last name" />
                        </Form.Group>
                        {/* </Form.Row> */}

                        {/* <Form.Row> */}
                        <Form.Group as={Col} controlId="userEmail">
                            {/* <Form.Label>Last Name</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="userEmail"
                            placeholder="Email" />
                        </Form.Group>
                        </Form.Row>



                        <Button 
                        variant="primary" 
                        type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
                </Col>
            </Row>
            <br />
            <br />

            <Row>
            <Table striped bordered hover size="sm" responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>

                {/* Display a message if we encounter an error */}
                {error ? <tr><td>{error.message}</td></tr> : null}
                {/* Here's our data check */}
                {!isLoading ? (
                    data.map(data => {
                    const { id, first_name, last_name, email } = data;
                    return (
                        
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{first_name}</td>
                                    <td>{last_name}</td>
                                    <td>{email}</td>
                                </tr>
    
                    );
                    })
                // If there is a delay in data, let's let the user know it's loading
                ) : (
                    <tr><td>Loading...</td></tr>
                )}

                </tbody>
            </Table>
            </Row>
            </Container>
        </div>
        );
    }
}
 
export default Users;