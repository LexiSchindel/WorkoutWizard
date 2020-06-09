import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
import { deleteData } from './deleteData';
import { submitData } from './submitData';
 
class Exercises extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            workouts: [],
            exercises: [],
            data: [],
            error: null,
            errorMessage: ''
          }

        this.submitHandle = this.submitHandle.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this); 
    }

    /************************************************
     * deleteHandle:
     * Gets the workoutId to delete and passes it to the
     * delete data function 
     * 
     * Delete request should return new "data" to update
     * state with
    ************************************************/
   deleteHandle(event, workout_exercise_id, id, exercise_order){
    event.preventDefault();

    let handle = '/deleteWorkoutExercise';

    let data = {
        workout_exercise_id: workout_exercise_id,
        id: id, 
        exerciseOrder: exercise_order
    };

    deleteData(data, handle)
    .then(newData => {
        if (newData.failure === undefined){
            this.setState({
                data: newData,
                errorMessage: '',
            });
        }
        else {
            this.setState({errorMessage: "You cannot delete the last exercise from a workout!"});
        }
    })
    .catch((error) => {
    console.error('Error:', error);
    });

  };

  /************************************************
   * submitHandle:
   * gets data from the form fields, then submits
   * using fetch. Will update the state to rerender
   * the page with the updated data. 
   * 
   * Post request should return new "data" to update
   * state with
  ************************************************/
  submitHandle(event) {
    event.preventDefault();
    const data = {
        exerciseId: event.target.elements.formExercise.value,
        workoutId: event.target.elements.formWorkout.value,
        repCount: event.target.elements.repCount.value,
        setCount: event.target.elements.setCount.value,
        exerciseOrder: event.target.elements.exerciseOrder.value
    };
    
    if (event.target.elements.repCount.value <= 0
        || event.target.elements.setCount.value <= 0
        || event.target.elements.exerciseOrder.value <= 0)
    {
        this.setState({errorMessage: "Sets, Reps and Exercise Order must be positive integer values!"});
    }
    else {
        submitData(data, '/insertWorkoutExercise')
        .then(newData => {
            this.setState({data: newData});
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      
          //reset form values
          event.target.elements.formExercise.value = '';
          event.target.elements.formWorkout.value = '';
          event.target.elements.repCount.value = '';
          event.target.elements.setCount.value = '';
          event.target.elements.exerciseOrder.value = '';
        this.setState({errorMessage: ''});
    }
  };

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
                        <p>
                            You can insert an exercise at the beginning, end or middle of 
                            the workout selected by choosing the appropriate Exercise Order.
                            <br />
                            <br />
                            If you choose an Exercise Order number greater than the total
                            exercises currently included in the workout, the new exercise 
                            will be inserted at the end of the Workout (with no gaps).
                            <br />
                            <br />
                            If you delete an Exercise from a workout, the remaining exercises will
                            move adjust order so order is maintained without gaps. You cannot delete 
                            the last exercise from a Workout as each Workout must have at least 1 
                            exercise. To delete the Workout, go to the Workouts page.
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form onSubmit={this.submitHandle}>
                        <Form.Label>Add Exercise to Workout</Form.Label>
                        
                        <Form.Row>

                        <Form.Group as={Col} controlId="formWorkout">
                            {/* <Form.Label>Workout Author</Form.Label> */}
                            <Form.Control as="select" placeholder="Search..." required>
                                <option></option>

                                {/* Loops through user names to populate form dropdown */}
                                {workouts.map(workouts => {
                                const { id, name } = workouts;
                                return (
                                    <option key={id} value={id}>{name}</option>
                                );
                                })}

                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formExercise">
                            {/* <Form.Label>Workout Author</Form.Label> */}
                            <Form.Control as="select" placeholder="Search..." required>
                                <option></option>

                                {/* Loops through user names to populate form dropdown */}
                                {exercises.map(exercises => {
                                const { id, name } = exercises;
                                return (
                                    <option key={id} value={id}>{name}</option>
                                );
                                })}

                            </Form.Control>
                        </Form.Group>
                        </Form.Row>

                        <Form.Row>

                            <Form.Group as={Col} controlId="repCount" required>
                                <Form.Label>Reps</Form.Label>
                                <Form.Control type="number" min="1" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="setCount" required>
                                <Form.Label>Sets</Form.Label>
                                <Form.Control type="number" min="1" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="exerciseOrder" required>
                                <Form.Label>Exercise Order</Form.Label>
                                <Form.Control type="number" min="1"/>
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
                <div>
                    { this.state.errorMessage &&
                        <p className="error"> { this.state.errorMessage } </p> 
                    }
                </div>
            </Row>

            <Row>
            <Table striped bordered hover size="sm" responsive>
                <thead>
                    <tr>
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
                    const { id, workout_exercise_id, workout_name, user_name, exercise_name, 
                        sets, reps, exercise_order } = data;
                    return (
                        
                                <tr key={i}>
                                    <td key = {id}>{workout_name}</td>
                                    <td >{user_name}</td>
                                    <td>{exercise_name}</td>
                                    <td>{reps}</td>
                                    <td>{sets}</td>
                                    <td>{exercise_order}</td>
                                    <td>
                                        <Button onClick={(e) => { this.deleteHandle(e, workout_exercise_id, id, exercise_order)}}
                                        variant="outline-danger" 
                                        type="delete"
                                        id={id}>
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