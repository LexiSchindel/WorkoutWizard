import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class NavBarMain extends React.Component {
    render() {
        return(
                <div>
                    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                        <Navbar.Brand as={Link} to="/">Workout Wizard</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavItem eventkey={1} href="/Workouts">
                                    <Nav.Link exact
                                        activeClassName="navbar__link--active"
                                        className="navbar__link" 
                                        as={Link} to="/Workouts" >Workouts</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={1} href="/Workouts_Exercises">
                                    <Nav.Link exact
                                        activeClassName="navbar__link--active"
                                        className="navbar__link" 
                                        as={Link} to="/Workouts_Exercises" >Workouts_Exercises</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={2} href="/Exercises">
                                    <Nav.Link exact
                                        activeClassName="navbar__link--active"
                                        className="navbar__link" 
                                         as={Link} to="/Exercises" >Exercises</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={3} href="/Muscle_Groups">
                                    <Nav.Link exact
                                        activeClassName="navbar__link--active"
                                        className="navbar__link" 
                                         as={Link} to="/Muscle_Groups" >Muscle Groups</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={4} href="/Users">
                                    <Nav.Link exact
                                        activeClassName="navbar__link--active"
                                        className="navbar__link" 
                                         as={Link} to="/Users" >Users</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={5} href="/Exercises_MuscleGroups">
                                    <Nav.Link exact
                                        activeClassName="navbar__link--active"
                                        className="navbar__link" 
                                         as={Link} to="/Exercises_MuscleGroups" >Exercises_MuscleGroups</Nav.Link>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
        )
    }
}

export default NavBarMain;