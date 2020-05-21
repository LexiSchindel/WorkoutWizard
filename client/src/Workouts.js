import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import { Row, Container, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import style from './style';
import { deleteData } from './deleteData';
import { submitData } from './submitData';
 
class Workouts extends Component {

    constructor() {
      super();
      this.state = {
        isLoading: true,
        data: [],
        users: [],
        exercises: [],
        error: null
      };
      // this.handleSubmit = this.submitData.bind(this);

      //need to bind "this" to our on click handles so it is able to update the state
      this.submitHandle = this.submitHandle.bind(this);
      this.deleteHandle = this.deleteHandle.bind(this);
    };

    /************************************************
     * deleteHandle:
     * Gets the workoutId to delete and passes it to the
     * delete data function 
     * 
     * Delete request should return new "data" to update
     * state with
    ************************************************/
    deleteHandle(event){
      event.preventDefault();

      let id = event.target.id;
      let handle = '/deleteWorkout';

      deleteData(id, handle)
      .then(newData => {
        this.setState({data: newData});
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
        workoutName: event.target.elements.workoutName.value,
        User: event.target.elements.User.value,
        exerciseId: event.target.elements.exerciseName.value,
        repCount: event.target.elements.repCount.value,
        setCount: event.target.elements.setCount.value,
      };
      
      submitData(data, '/insertWorkout')
      .then(newData => {
        this.setState({data: newData});
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      //reset form values
      event.target.elements.workoutName.value = "";
      event.target.elements.User.value = "";
      event.target.elements.exerciseName.value = "";
      event.target.elements.repCount.value = "";
      event.target.elements.setCount.value = "";
    };

    componentDidMount() {
        // Simple GET request using fetch
        fetch('/getWorkoutsUsers')
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
           .then((exercises) =>
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

        return (
        <div>
            <Container>
            <br />
                <Row>
                    <div>
                        <p>Here are the current Workouts in the repository.
                          You can add a new one of your own. Since a workout must have 
                          at least one exercise, you must enter an exercise when you 
                          enter a new workout.
                        </p>

                        <p>Deleting a workout will delete the entire workout, including all exercise
                          associations in Workouts_Exercises.
                        </p>

                        <p>You can update a workout name, user (who created the workout), and even update
                          the user to null (remove the connection between workout and user).
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                <Form onSubmit={this.submitHandle}>
                  <Form.Row>
                  <Form.Group as={Col} controlId="workoutName">
                    <Form.Label>Workout</Form.Label>
                    <Form.Control required type="text"/>
                  </Form.Group>

                  <Form.Group as={Col} controlId="User">
                    <Form.Label>Workout Author</Form.Label>
                    <Form.Control required as="select" placeholder="Select User...">
                      <option></option>

                      {/* Loops through user names to populate form dropdown */}
                      {users.map(users => {
                        const { id, user_name } = users;
                        return (
                          <option key={id} value={id}>{user_name}</option>
                        );
                        })}

                    </Form.Control>
                  </Form.Group>
                  </Form.Row>

                  <Form.Row>
                  <Form.Group as={Col} controlId="exerciseName">
                    <Form.Label>Exercise</Form.Label>
                    <Form.Control required as="select" placeholder="Select Exercise...">
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

                  <Form.Group as={Col} controlId="repCount">
                    <Form.Label>Reps</Form.Label>
                    <Form.Control required type="number"/>
                  </Form.Group>

                  <Form.Group as={Col} controlId="setCount">
                    <Form.Label>Sets</Form.Label>
                    <Form.Control required type="number"/>
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
                        <th># of Exercises</th>
                        <th>Delete</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>

                {/* Display a message if we encounter an error */}
                {error ? <tr><td>{error.message}</td></tr> : null}
                {/* Here's our data check */}
                {!isLoading ? (
                    
                    data.map((data, i) => {
                      const { id, workout_name, user_name, total_exercises } = data;
                      return (
                          
                                  <tr key={i}>
                                      <td >{id}</td>
                                      <td key = {id}>{workout_name}</td>
                                      <td >{user_name}</td>
                                      <td>{total_exercises}</td>
                                      <td>
                                          <Button onClick={this.deleteHandle}
                                          variant="outline-danger" 
                                          type="delete"
                                          id={id}>
                                              Delete Workout
                                          </Button>
                                    </td>
                                    <td>
                                          <Button 
                                          variant="outline-info" 
                                          type="update">
                                              Update Workout
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
 
export default Workouts;