import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';

const local = 'http://localhost:5000/'
const heroku = 'https://workout-wizard.herokuapp.com/'
 
class Workouts extends Component {

    state = {
        isLoading: true,
        data: [],
        users: [],
        error: null
      }

    componentDidMount() {
        // Simple GET request using fetch
        fetch(heroku + 'getTable?table=Workouts')
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
        fetch(heroku + 'getUsers')
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
        const { isLoading, data, error, users } = this.state;

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
                    <Form.Label>User</Form.Label>
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
                        <th>Workout Created</th>
                        <th>Workout Updated</th>
                        <th>User Id</th>
                    </tr>
                </thead>
                <tbody>

                {/* Display a message if we encounter an error */}
                {error ? <tr><td>{error.message}</td></tr> : null}
                {/* Here's our data check */}
                {!isLoading ? (
                    data.map(data => {
                    const { id, name, created_at, updated_at, user_id } = data;
                    return (
                        
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>{created_at}</td>
                                    <td>{updated_at}</td>
                                    <td>{user_id}</td>
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