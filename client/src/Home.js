import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container } from 'react-bootstrap'
 
class Home extends Component {

    state = {
        isLoading: true,
        data: [],
        users: [],
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
    }

    render() {
        const { isLoading, data, error } = this.state;
        console.log("data: ", data);
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
                  <div>
                      <p>Some search functionality here so you can search all the 
                        workouts in the repository by workout name, exercises, muscle
                        groups, etc.
                      </p>
                  </div>
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
 
export default Home;