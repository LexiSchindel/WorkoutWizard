import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap';
import './index.css';

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '', 
            workout_name: '',
            user: '',
            user_id: '', 
            isOpen: false,
            allUsers: [],
            workouts: [],
            modalTitle: '',
            isLoading: true,
        }

        this.updateHandle = this.updateHandle.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    updateHandle(event){
        event.preventDefault();

        const data = {
            workoutName: event.target.elements.workoutName.value,
            workoutId: this.state.id,
            user_id: event.target.elements.workoutUser.value,
          };

          this.props.updateSend(data);

          this.setState({
              isOpen: false,
          });
    };

    componentDidMount() {
        fetch('/getUsers')
            .then((response) => {
                return response.json();
            })
            .then(users =>
                this.setState({
                allUsers: users,
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
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // Check to see if the requestRefresh prop has changed
        if (nextProps.contents.isOpen === true) {
            console.log(nextProps);
            if (nextProps.contents.user_id === null)
            {    return {
                user: nextProps.contents.user_name,
                user_id: "null",
                id: nextProps.contents.id,
                workout_name: nextProps.contents.workout_name,
                isOpen: nextProps.contents.isOpen,
                modalTitle: nextProps.contents.modalTitle,
                isLoading: false,
            }}
            else
            {    return {
                    user: nextProps.contents.user_name,
                    user_id: nextProps.contents.user_id,
                    id: nextProps.contents.id,
                    workout_name: nextProps.contents.workout_name,
                    isOpen: nextProps.contents.isOpen,
                    modalTitle: nextProps.contents.modalTitle,
                    isLoading: false,
                }}
        }
        else {
            return {
                isOpen: nextProps.contents.isOpen,
            }
        }
    }

    handleClose() {
        this.props.parentClose();
      }

    render() {
        return (
        <div>
            <Modal 
            show={this.state.isOpen}
            onHide={this.handleClose}>
                <Modal.Body>
                    <Form onSubmit={this.updateHandle}>
                        <Form.Label className="text-center" style={{width: "100%"}}>
                            <h4>{this.state.modalTitle}</h4>
                        </Form.Label>
                        <Form.Row>

                            <Form.Group as={Col} controlId="workoutName">
                                <Form.Label>Workout Name</Form.Label>
                                <Form.Control required type="text"
                                defaultValue={this.state.workout_name}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="workoutUser">
                                <Form.Label>Workout Author</Form.Label>
                                <Form.Control as="select" 
                                defaultValue={this.state.user_id}>
                                    {/* Loops through user names to populate form dropdown */}
                                    {this.state.allUsers.map(allUsers => {
                                        const { id, user_name } = allUsers;
                                        return (
                                        <option key={id} value={id}>{user_name}</option>
                                        );
                                    })}
                                    <option value="null" id="null"></option>

                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Button 
                            variant="primary" 
                            type="submit">
                                Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        )
    }

}

export default UpdateModal;

