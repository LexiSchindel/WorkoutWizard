import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from "./Home";
import Workouts from "./Workouts";
import Workouts_Exercises from "./Workouts_Exercises";
import Exercises from "./Exercises";
import Muscle_Groups from "./Muscle_Groups";
import Users from "./Users";
import Exercises_MuscleGroups from "./Exercises_MuscleGroups";

const Routes = () => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/Workouts' component={Workouts} />
        <Route exact path='/Workouts_Exercises' component={Workouts_Exercises} />
        <Route exact path='/Exercises' component={Exercises} />
        <Route exact path='/Muscle_Groups' component={Muscle_Groups} />
        <Route exact path='/Users' component={Users} />
        <Route exact path='/Exercises_MuscleGroups' component={Exercises_MuscleGroups} />
    </Switch>
);

export default Routes;