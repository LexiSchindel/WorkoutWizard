import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
import Spinner from 'react-bootstrap/Spinner'

class Muscle_Groups extends Component {




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
            muscleGroupName: event.target.elements.formMuscleGroups.value
        };
        
        fetch('/insertMuscleGroup', {
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
                this.setState({errorMessage: "You cannot submit a muscle group that already exists!"});
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            });
    
            event.target.elements.formMuscleGroups.value = '';
    }






    componentDidMount() {
        // Simple GET request using fetch
        fetch('/getTable?table=Muscle_Groups')
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
                        <p>Muscle Groups are used to categorize exercises.
                            Please add new muscle groups to further develop our library.
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form onSubmit={this.submitData}>
						<Form.Label>Add Muscle Group</Form.Label>

                        <Form.Group controlId="formMuscleGroups">
                            <Form.Control 
                            required 
                            type="text" 
                            name="muscleGroupName"
                            placeholder="Muscle group name" />
                        </Form.Group>
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
            <br />
            <br />

            <Row>
            <Table striped bordered hover size="sm" responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Muscle Group</th>
                    </tr>
                </thead>
                <tbody>

                {/* Display a message if we encounter an error */}
                {error ? <tr><td>{error.message}</td></tr> : null}
                {/* Here's our data check */}
                {!isLoading ? (
                    data.map(data => {
                    const { id, name } = data;
                    return (
                        
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{name}</td>
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
            </Container>
        </div>
        );
    }
}
 
export default Muscle_Groups;