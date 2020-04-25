import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Row, Container, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from './style';
 
class Exercises extends Component {

    state = {
        isLoading: true,
        data: [],
        error: null
      }

    componentDidMount() {
        // Simple GET request using fetch
        fetch('getTable?table=Exercises')
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
                        <p>A variety of exercises you can add to your workouts.
                            Please add new exercises to further develop our library.
                        </p>
                    </div>
                </Row>
            <br />

            <Row>
                <Col>
                <div style={style.inputForm}>
                    <Form>
                        <Form.Group controlId="formExercise">
                            <Form.Label>Exercise</Form.Label>
                            <Form.Control 
                            required 
                            type="text" 
                            name="exerciseName"
                            placeholder="Enter new exercise" />
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
            <br />
            <br />

            <Row>
            <Table striped bordered hover size="sm" responsive>
                <thead>
                    <tr>
                        <th>ID</th>
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
                                    <td>{id}</td>
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