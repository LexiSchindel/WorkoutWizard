import React from 'react';
import { Nav, Navbar } from 'react-bootstrap'

class NavBarMain extends React.Component {
    render() {
        return(
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Navbar.Brand href="#home">Workout Wizard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Workouts</Nav.Link>
                        <Nav.Link href="#link">Exercises</Nav.Link>
                        <Nav.Link href="#link">Muscle Groups</Nav.Link>
                        <Nav.Link href="#link">Users</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default NavBarMain;