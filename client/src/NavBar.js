import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Home from "./Home";
import Workouts from "./Workouts";
import Workouts_Exercises from "./Workouts_Exercises";
import Exercises from "./Exercises";
import Muscle_Groups from "./Muscle_Groups";
import Users from "./Users";
import Exercises_MuscleGroups from "./Exercises_MuscleGroups";

class NavBarMain extends React.Component {
    render() {
        return(
            <div>
                <BrowserRouter>
                <div>
                    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                        <Navbar.Brand as={Link} to="/">Workout Wizard</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavItem eventkey={1} href="/Workouts">
                                    <Nav.Link as={Link} to="/Workouts" >Workouts</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={1} href="/Workouts_Exercises">
                                    <Nav.Link as={Link} to="/Workouts_Exercises" >Workouts_Exercises</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={2} href="/Exercises">
                                    <Nav.Link as={Link} to="/Exercises" >Exercises</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={3} href="/Muscle_Groups">
                                    <Nav.Link as={Link} to="/Muscle_Groups" >Muscle Groups</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={4} href="/Users">
                                    <Nav.Link as={Link} to="/Users" >Users</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={5} href="/Exercises_MuscleGroups">
                                    <Nav.Link as={Link} to="/Exercises_MuscleGroups" >Exercises_MuscleGroups</Nav.Link>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/Workouts' component={Workouts} />
                        <Route exact path='/Workouts_Exercises' component={Workouts_Exercises} />
                        <Route exact path='/Exercises' component={Exercises} />
                        <Route exact path='/Muscle_Groups' component={Muscle_Groups} />
                        <Route exact path='/Users' component={Users} />
                        <Route exact path='/Exercises_MuscleGroups' component={Exercises_MuscleGroups} />
                        <Route render={function () {
                            return <p>Not found</p>
                        }} />
                    </Switch>
                </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default NavBarMain;