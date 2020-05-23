import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
import Spinner from 'react-bootstrap/Spinner'
 
class Users extends Component {

	constructor() {
        super();
        this.state = {
            isLoading: true,
            data: [],
            error: null,
            errorMessage:''
        };
        this.handleSubmit = this.submitData.bind(this);

        //need to bind "this" to submitData so it is able to update the state
        this.submitData = this.submitData.bind(this);
        
        
        this.searchData = this.searchData.bind(this);
    }


    /************************************************
     * searchData:
     * gets data from the form fields, then submits
     * using fetch. Will update the state to rerender
     * the page with the updated data. 
     * 
     * Post request should return new "data" to update
     * state with
    ************************************************/
   searchData(event) {
    event.preventDefault();
    const searchData = {

        searchParameter: event.target.elements.formSearchParameter.value
    };
    console.log("search click");

    fetch('/searchUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(searchData)
    })
    .then(response => response.json())
    .then(newData => {
        if (newData.failure === undefined){
            this.setState({
                data: newData,
                errorMessage: '',
            });
        }
        else {
            this.setState({errorMessage: "User does not exist"});
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        });

        event.target.elements.formSearchParameter.value = '';
}

    /************************************************
     * submitData:
     * gets data from the form fields, then submits
     * using fetch. Will update the state to rerender
     * the page with the updated data. 
     * 
     * Post request should return new "data" to update
     * state with
    ************************************************/
   submitData(event) {
        event.preventDefault();
        const submitData = {
            firstName: event.target.elements.formFirstName.value,
            lastName: event.target.elements.formLastName.value,
            email: event.target.elements.formEmail.value
        };
        
        fetch('/insertUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(submitData)
        })
        .then(response => response.json())
        .then(newData => {
            if (newData.failure === undefined){
                this.setState({
                    data: newData,
                    errorMessage: '',
                });
            }
            else {
                this.setState({errorMessage: "Please enter a unique email"});
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            });

            event.target.elements.formFirstName.value = '';
            event.target.elements.formLastName.value = '';
            event.target.elements.formEmail.value = '';
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

            


            {/* SEARCH */}
            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form onSubmit={this.searchData}>
                        <Form.Label>Search User</Form.Label>

                        <Form.Row>
                        <Form.Group as={Col} controlId="formSearchParameter">
                            {/* <Form.Label>Add User</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="searchParameter"
                            placeholder="First name, Last name, or email" />
                        </Form.Group>
                        </Form.Row>

{/*                     
                        <Form.Row>

                        <Form.Group as={Col} controlId="search">
                        <fieldset>
                            <Form.Group as={Row}>
                            <Form.Label as="legend" column sm={12}>
                                Search parameter type
                            </Form.Label>
                            <Col sm={12}>
                                <Form.Check
                                type="radio"
                                label="First name"
                                name="formHorizontalRadios"
                                id="formHorizontalRadios1"
                                />
                                <Form.Check
                                type="radio"
                                label="Last name"
                                name="formHorizontalRadios"
                                id="formHorizontalRadios2"
                                />
                                <Form.Check
                                type="radio"
                                label="Email"
                                name="formHorizontalRadios"
                                id="formHorizontalRadios3"
                                />
                            </Col>
                            </Form.Group>
                        </fieldset>
                        </Form.Group>

                        </Form.Row> */}

                        <Button 
                        variant="primary" 
                        type="submit">
                            Search
                        </Button>
                    </Form>
                </div>
                </Col>
            </Row>
            <br />
            <br />

            {/* TABLE */}
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
                    <tr><td colSpan="4">Loading &nbsp;
                        <Spinner animation="border" size ="sm" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </td></tr>
                )}

                </tbody>
            </Table>
            </Row>
            <br />
            <br />

            {/* ADD */}
            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form onSubmit={this.submitData}>
                        <Form.Label>Add User</Form.Label>

                        <Form.Row>
                        <Form.Group as={Col} controlId="formFirstName">
                            {/* <Form.Label>Add User</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="firstName"
                            placeholder="First name" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formLastName">
                            {/* <Form.Label>Last Name</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="lastName"
                            placeholder="Last name" />
                        </Form.Group>
                        {/* </Form.Row> */}

                        {/* <Form.Row> */}
                        <Form.Group as={Col} controlId="formEmail">
                            {/* <Form.Label>Last Name</Form.Label> */}
                            <Form.Control 
                            required 
                            type="text" 
                            name="email"
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

            {/* Error message */}
            <Row>
                <div>
                    { this.state.errorMessage &&
                        <p className="error"> { this.state.errorMessage } </p> 
                    }
                </div>
            </Row>

            </Container>

            
        </div>
        );
    }
}
 
export default Users;