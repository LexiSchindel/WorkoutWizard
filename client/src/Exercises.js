import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
 
class Exercises extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            data: [],
            muscleGroups: [],
            error: null,
            errorMessage: ''
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
            exerciseName: event.target.elements.formExercise.value,
            muscleGrpId: event.target.elements.formMuscleGroup.value
        };
        
        fetch('/insertExercise', {
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
                this.setState({errorMessage: "You cannot submit an exercise that already exists!"});
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });

        event.target.elements.formExercise.value = '';
        event.target.elements.formMuscleGroup.value = '';
        }

    componentDidMount() {
        // Simple GET request using fetch
        fetch('/getTable?table=Exercises')
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

         // Get the Muscle Groups
         fetch('/getTable?table=Muscle_Groups')
         .then((response) => {
             return response.json();
           })
           .then(muscleGroups =>
             this.setState({
               muscleGroups: muscleGroups,
               isLoading: false,
             })
           )
         // Catch any errors we hit and update the app
         .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { isLoading, data, error, muscleGroups } = this.state;

        return (
        <div>
            <Container>
            <br />
                <Row>
                    <div>
                        <p>
                            Please add new exercises to further develop our library.
                            <br />
                            <br />
                            We would like you to also add a muscle group associated with that exercise.
                            You can select 1 association here but add additional muscle groups on the
                            Muscle Groups page. 
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form onSubmit={this.submitData}>
                        <Form.Label>Add Exercise</Form.Label>
                        
                        <Form.Row>
                        <Form.Group as={Col} controlId="formExercise">
                            <Form.Control 
                            required 
                            type="text" 
                            name="exerciseName"
                            placeholder="Exercise name" />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formMuscleGroup">
                            {/* <Form.Label>Workout Author</Form.Label> */}
                            <Form.Control as="select" placeholder="Search..." required>
                                <option></option>

                                {/* Loops through user names to populate form dropdown */}
                                {muscleGroups.map(muscleGroups => {
                                const { id, name } = muscleGroups;
                                return (
                                    <option key={id} value={id}>{name}</option>
                                );
                                })}

                            </Form.Control>
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
                        <th>Exercise</th>
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
                                    <td>{name}</td>
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
 
export default Exercises;