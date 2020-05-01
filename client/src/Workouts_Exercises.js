import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
 
class Exercises extends Component {

    state = {
        isLoading: true,
        workouts: [],
        exercises: [],
        data: [],
        error: null
      }

    componentDidMount() {
        // Simple GET request using fetch
        fetch('/getWorkouts')
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

        // Simple GET request using fetch
        fetch('/getTable?table=Workouts')
        .then((response) => {
            return response.json();
          })
          .then(workouts =>
            this.setState({
                workouts: workouts,
              isLoading: false,
            })
          )
        // Catch any errors we hit and update the app
        .catch(error => this.setState({ error, isLoading: false }));

         // Get the Muscle Groups
         fetch('/getTable?table=Exercises')
         .then((response) => {
             return response.json();
           })
           .then(exercises =>
             this.setState({
                exercises: exercises,
               isLoading: false,
             })
           )
         // Catch any errors we hit and update the app
         .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { isLoading, workouts, error, exercises, data } = this.state;

        return (
        <div>
            <Container>
            <br />
                <Row>
                    <div>
                        <p>A variety of exercises you can add to your workouts. 
                            You can insert an exercise at the beginning, end or middle of 
                            the workout selected by choosing the appropriate Exercise Order.
                            <br />
                            If you choose an Exercise Order number greater than the total
                            exercises currently included in the workout, the new exercise 
                            will be inserted at the end of the Workout.
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form>
                        <Form.Label>Add Exercise to Workout</Form.Label>
                        
                        <Form.Row>

                        <Form.Group as={Col} controlId="formWorkout">
                            {/* <Form.Label>Workout Author</Form.Label> */}
                            <Form.Control as="select" placeholder="Search..." required>
                                <option>Select Workout...</option>

                                {/* Loops through user names to populate form dropdown */}
                                {workouts.map(workouts => {
                                const { id, name } = workouts;
                                return (
                                    <option key={id}>{name}</option>
                                );
                                })}

                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formExercise">
                            {/* <Form.Label>Workout Author</Form.Label> */}
                            <Form.Control as="select" placeholder="Search..." required>
                                <option>Select Exercise...</option>

                                {/* Loops through user names to populate form dropdown */}
                                {exercises.map(exercises => {
                                const { id, name } = exercises;
                                return (
                                    <option key={id}>{name}</option>
                                );
                                })}

                            </Form.Control>
                        </Form.Group>
                        </Form.Row>

                        <Form.Row>

                            <Form.Group as={Col} controlId="repCount">
                                <Form.Label>Reps</Form.Label>
                                <Form.Control />
                            </Form.Group>

                            <Form.Group as={Col} controlId="setCount">
                                <Form.Label>Sets</Form.Label>
                                <Form.Control />
                            </Form.Group>

                            <Form.Group as={Col} controlId="exerciseOrder">
                                <Form.Label>Exercise Order</Form.Label>
                                <Form.Control />
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
                        <th>Workout Name</th>
                        <th>Workout Author</th>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Sets</th>
                        <th>Exercise Order</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>

                {/* Display a message if we encounter an error */}
                {error ? <tr><td>{error.message}</td></tr> : null}
                {/* Here's our data check */}
                {!isLoading ? (
                    data.map((data, i) => {
                    const { id, workout_name, user_name, exercise_name, 
                        sets, reps, exercise_order } = data;
                    return (
                        
                                <tr key={i}>
                                    <td >{id}</td>
                                    <td key = {id}>{workout_name}</td>
                                    <td >{user_name}</td>
                                    <td>{exercise_name}</td>
                                    <td>{sets}</td>
                                    <td>{reps}</td>
                                    <td>{exercise_order}</td>
                                    <td>
                                        <Button 
                                        variant="outline-danger" 
                                        type="delete">
                                            Delete Exercise
                                        </Button>
                                  </td>
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