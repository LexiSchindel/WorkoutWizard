import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
 
class Workouts extends Component {

    state = {
        isLoading: true,
        data: [],
        users: [],
        exercises: [],
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

        // Get the Users
        fetch('/getUsers')
        .then((response) => {
            return response.json();
          })
          .then(users =>
            this.setState({
              users: users,
              isLoading: false,
            })
          )
        // Catch any errors we hit and update the app
        .catch(error => this.setState({ error, isLoading: false }));

        // Get the Exercises
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
        const { isLoading, data, error, users, exercises} = this.state;
        let rowKey = 0;

        return (
        <div>
            <Container>
            <br />
                <Row>
                    <div>
                        <p>Here are the current Workouts in the repository.
                          You can add a new one of your own. 
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                <Form>
                  <Form.Row>
                  <Form.Group as={Col} controlId="workoutName">
                    <Form.Label>Workout</Form.Label>
                    <Form.Control />
                  </Form.Group>

                  <Form.Group as={Col} controlId="User">
                    <Form.Label>Workout Author</Form.Label>
                    <Form.Control as="select" placeholder="Search...">
                      <option>Choose...</option>

                      {/* Loops through user names to populate form dropdown */}
                      {users.map(users => {
                        const { id, user_name } = users;
                        return (
                          <option key={id}>{user_name}</option>
                        );
                        })}

                    </Form.Control>
                  </Form.Group>
                  </Form.Row>

                  <Form.Row>
                  <Form.Group as={Col} controlId="exerciseName">
                    <Form.Label>Exercise</Form.Label>
                    <Form.Control as="select" placeholder="Search...">
                      <option>Choose...</option>

                      {/* Loops through user names to populate form dropdown */}
                      {exercises.map(exercises => {
                        const { id, name } = exercises;
                        return (
                          <option key={id}>{name}</option>
                        );
                        })}

                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="repCount">
                    <Form.Label>Reps</Form.Label>
                    <Form.Control />
                  </Form.Group>

                  <Form.Group as={Col} controlId="setCount">
                    <Form.Label>Sets</Form.Label>
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
                      sets, reps, exercise_order, total_exercises } = data;
                    if (rowKey !== id){
                      rowKey = id;
                    
                    return (

                                <tr rowSpan={total_exercises} key={i} id={id}>
                                  <td >{id}</td>
                                  <td >{workout_name}</td>
                                  <td >{user_name}</td>
                                  <td>{exercise_name}</td>
                                  <td>{sets}</td>
                                  <td>{reps}</td>
                                  <td>{exercise_order}</td>
                                  <td>
                                    <Button 
                                      variant="outline-danger" 
                                      type="delete">
                                          Delete Workout
                                    </Button>
                                  </td>
                                </tr>
                    );
                  }
                  else {
                    return (
                      <tr key={i} id={id}>
                      <td colSpan="3"></td>
                      <td>{exercise_name}</td>
                      <td>{sets}</td>
                      <td>{reps}</td>
                      <td>{exercise_order}</td>
                      </tr>
                    );
                  }
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
 
export default Workouts;