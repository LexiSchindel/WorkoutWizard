import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Home from "./Home";
import Workouts from "./Workouts";
import Exercises from "./Exercises";
import Users from "./Users";

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
                                <NavItem eventkey={2} href="/Exercises">
                                    <Nav.Link as={Link} to="/Exercises" >Exercises</Nav.Link>
                                </NavItem>
                                <NavItem eventkey={3} href="/Users">
                                    <Nav.Link as={Link} to="/Users" >Users</Nav.Link>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/Workouts' component={Workouts} />
                        <Route exact path='/Exercises' component={Exercises} />
                        <Route exact path='/Users' component={Users} />
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