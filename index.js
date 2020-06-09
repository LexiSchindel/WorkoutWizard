const express = require('express');
const path = require('path');
var mysql = require('./dbcon.js');
const env = require('dotenv').config();
var cors = require('cors')

const app = express();
const RSVP = require('rsvp');
app.use(require("body-parser").json());

//so we can make requests on local server
app.use(cors())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/*********************************************************
parameterQuery:  
Executes a query that has parameters (insert delete, etc)
Receives: JSON object with text and placeholder_arr values
Returns: rows (from query execution)
*********************************************************/
function parameterQuery(query) {
    return new Promise(function(resolve, reject) {
        try {
            mysql.pool.query(query.text, query.placeholder_arr, function(err, rows, fields) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            });
        } catch (err) {
            return reject(err);
        }
    })
};

/*********************************************************
executeParameterQuery:  
Executes the query and returns all the rows
from the results back to the callback which well send to 
the client
Receives: JSON object with text + placeholder_arr values, callback
Returns: nothing (sends back rows to callback function)
*********************************************************/
function executeParameterQuery(query, callback) {
    mysql.pool.query(query.text, query.placeholder_arr, function(err, rows) {
        if(err){
            console.log('error');
            next(err);
        }
        // console.log("row: ", rows);
        callback(rows);
    });
}

/*********************************************************
executeQuery: 
Executes the query and returns all the rows
from the results back to the callback which well send to 
the client
Receives: query - query string; callback - callback function
Returns: nothing (sends back rows to callback function)
*********************************************************/
function executeQuery(query, callback){
    mysql.pool.query(query, function(err, rows){
        if(err){
            console.log('error');
            next(err);
        }
        // console.log("row: ", rows);
        callback(rows);
    });
}

/*********************************************************
promiseWhile: 
Allows us to loop through queries sequentially
Receives: condition that evaluates to true/false
and body that should execute each While iteration
Returns: sends rows back to repopulate table
*********************************************************/
function promiseWhile(condition, body) {
    return new RSVP.Promise(function(resolve,reject){
    
        function loop() {
            RSVP.Promise.resolve(condition()).then(function(result){
                // When the result of calling `condition` is no longer true, we are done.
                if (!result){
                    resolve();
                } else {
                    // When it completes loop again otherwise, if it fails, reject
                    RSVP.Promise.resolve(body()).then(loop,reject);
                }
            });
        }
    
        // Start running the loop
        loop();
    });
}

/*********************************************************
successCallback: 
Executes when we have a successful insert/delete
Receives: query text to execute (no parameters) and the res
so we can send back context using res.send
Returns: Nothin
*********************************************************/
function successCallback(query, res){
    //execute the query and the send the results back to the client
    executeQuery(query, function(context){
        res.send(context);
    });
  }

/*********************************************************
successCallbackParameter: 
Executes when we have a successful insert/delete
Receives: query text to execute (with parameters parameters) and the res
so we can send back context using res.send
Returns: Nothing
*********************************************************/
function successCallbackParameter(query, res){
    //execute the query and the send the results back to the client
    executeParameterQuery(query, function(context){
        res.send(context);
    });
}

/*********************************************************
errorCallback: 
Executes when we have an error with our query
Receives: Nothing
Returns: Nothin
*********************************************************/
function errorCallback(){
    console.log('Error while executing SQL Query');
  }

/*********************************************************
Queries
*********************************************************/  
//used for Workouts page to display basic workout info and total exercises
workoutUsers = 
"select " +
  "ww.id, " +
  "uu.id as user_id, " + 
  "ww.name as workout_name, " +
  "CONCAT(uu.first_name, ' ', uu.last_name) as user_name, " +
  "COUNT(distinct we.id) as total_exercises " +
  
  "from workouts ww " +
  "left join workouts_exercises we on we.workout_id = ww.id " +
  "left join users uu on uu.id = ww.user_id " +

  "group by 1,2,3,4 " +
  
  "order by ww.id" +
  ";";

//used for Workouts Exercises and Home pages to display detailed workout info
  workoutSummary = 
  "select " +
    "ww.id, " +
    "we.id as workout_exercise_id, " +
    "ww.name as workout_name, " +
    "uu.id as user_id, " +
    "CONCAT(uu.first_name, ' ', uu.last_name) as user_name, " +
    "ee.name as exercise_name, " +
    "we.sets, " +
    "we.reps, " +
    "we.exercise_order, " +
    "mg.muscle_grps, " +
    "COALESCE(tt.total_exercises,1) as total_exercises " +
    
    "from workouts ww " +
    "left join workouts_exercises we on we.workout_id = ww.id " +
    "left join users uu on uu.id = ww.user_id " +
    "left join exercises ee on ee.id = we.exercise_id " +
    "left join (select workout_id, count(*) as total_exercises "  +
    "from workouts_exercises " +
    "group by 1) tt on tt.workout_id = ww.id " +
    "left join (select emg.exercise_id, GROUP_CONCAT(DISTINCT mg.name SEPARATOR ', ') as muscle_grps " +
	"from exercises_musclegroups emg " +
	"left join muscle_groups mg on mg.id = emg.musclegrp_id " +
    "group by 1 " +
    ") mg on mg.exercise_id = we.exercise_id " +
    
    "order by ww.id, we.exercise_order" +
    ";";

    // used for exercises_musclegroups page to display table
    exercisesMuscleGroups =
    "SELECT " +
    "emg.id, " +
    "ee.name as exercise_name, " +
    "mg.name as musclegrp_name " +
    
    "FROM exercises_musclegroups emg " +
    "JOIN exercises ee on ee.id = emg.exercise_id " +
    "JOIN muscle_groups mg on mg.id = emg.musclegrp_id " +
    "ORDER BY ee.name ASC" +
    ";";

/*********************************************************
/getTable handle:  
Grabs all the data from the table (based on the passed
table name from the query string) and returns to the client.
Receives: table from query string
Returns: all rows from that table
*********************************************************/
app.get('/getTable', async function(req,res,next){
    let table = req.query.table;

    //if we don't have a table name in our query string, error
    if(!table){
        next(err);
        return;
    }

    let query = "SELECT * FROM `" + (process.env.CLEARDB_DATABASE_NAME || env.parsed.CLEARDB_DATABASE_NAME) +
    "`." + table + ";";

    //execute the query and the send the results back to the client
    executeQuery(query, function(context){
        res.send(context);
    });
});

/*********************************************************
/getUsers handle:  
Grabs all the data from the table (based on the passed
table name from the query string) and returns to the client.
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.get('/getUsers', async function(req,res,next){

    let query = "SELECT id, CONCAT(first_name, ' ', last_name) as user_name FROM `" + (process.env.CLEARDB_DATABASE_NAME || env.parsed.CLEARDB_DATABASE_NAME) +
    "`.users;";

    //execute the query and the send the results back to the client
    executeQuery(query, function(context){
        res.send(context);
    });
});

/*********************************************************
/getWorkouts handle:  
Grabs all the data from the table (based on the passed
table name from the query string) and returns to the client.
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.get('/getWorkouts', async function(req,res,next){

    //execute the query and the send the results back to the client
    executeQuery(workoutSummary, function(context){
        res.send(context);
    });
});

/*********************************************************
/insertWorkout' handle:  
Inserts a workout into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertWorkout', function(req,res,error){

    var query1 = {};

    let queryText = "INSERT INTO Workouts (name, created_at, updated_at, user_id) " +
    "VALUES (?, now(), now(), ?);";

    let queryNullUserText = "INSERT INTO Workouts (name, created_at, updated_at, user_id) " +
    "VALUES (?, now(), now(), NULL);";

    let queryText2 = "INSERT INTO Workouts_Exercises (workout_id, exercise_id, sets, reps, exercise_order) " +
        "VALUES (?, " + //workoutId from the insert id returned by insert query
        "?, " + //exerciseId
        "?, ?, 1 " + //sets, reps, exerciseOrder
        ");";

    if (req.body.User === ""){
        query1 = {
            text : queryNullUserText,
            placeholder_arr : [req.body.workoutName],
        };
    }
    else {
        query1 = {
            text : queryText,
            placeholder_arr : [req.body.workoutName, req.body.User],
        };
    }

    //Insert new workout into Workouts
    parameterQuery(query1)
    //Then insert the submitted exercise into Workouts_Exercises
    .then((row) => {
        var query2 = {
            text : queryText2,
            placeholder_arr : [row.insertId, req.body.exerciseId, req.body.setCount, req.body.repCount],
        };
        return parameterQuery(query2)})
        //then get updated data to return back as the post response
    .then(() => successCallback(workoutUsers, res))
    .catch(errorCallback);
});

/*********************************************************
/updateWorkout handle:  
Inserts a workout into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/updateWorkout', function(req,res,error){

    let queryText = "UPDATE Workouts SET name = ?, user_id = ?, updated_at = Now() " +
    "WHERE id = ?;";

    let nullQueryText = "UPDATE Workouts SET name = ?, user_id = NULL, updated_at = Now() " +
    "WHERE id = ?;";

    let query1 = {};

    if (req.body.user_id === "null"){
        query1 = {
            text : nullQueryText,
            placeholder_arr : [req.body.workoutName, req.body.workoutId],
        };
    }
    else {
        query1 = {
            text : queryText,
            placeholder_arr : [req.body.workoutName, req.body.user_id, req.body.workoutId],
        };
    }  

    //Insert new workout into Workouts
    parameterQuery(query1)
    //then get updated data to return back as the post response
    .then(() => successCallback(workoutUsers, res)).catch(errorCallback);
});

/*********************************************************
/deleteWorkout' handle:  
Deletes a workout from the database
Receives: id to delete (Workout.id 
    and Workouts_Exercises.workout_id)
Returns: all rows from that table
*********************************************************/
app.post('/deleteWorkout', function(req,res,error){

    let id = parseInt(req.body.id);

    let queryText = "DELETE FROM Workouts_Exercises WHERE workout_id = ?;";

    let queryText2 = "DELETE FROM Workouts WHERE id = ?;";

    var query1 = {
        text : queryText,
        placeholder_arr : [id],
    };

    var query2 = {
        text : queryText2,
        placeholder_arr : [id],
    };

    //Insert new workout into Workouts
    parameterQuery(query1)
    //Then insert the submitted exercise into Workouts_Exercises
    .then(() => {
        parameterQuery(query2)})
        //then get updated data to return back as the post response
        .then(() => successCallback(workoutUsers, res)).catch(errorCallback);
});

/*********************************************************
/insertWorkoutExercise' handle:  
Inserts an exercise into an existing workout. Will update
exercise order appropriately
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertWorkoutExercise', function(req,res,error){

    let maxOrderQuery = "SELECT max(exercise_order) as max FROM Workouts_Exercises " +
        "WHERE workout_id = ?";

    let queryText = "UPDATE Workouts_Exercises SET exercise_order = ? " +
    "WHERE workout_id = ? AND exercise_order = ?;";

    let queryText2 = "INSERT INTO Workouts_Exercises (workout_id, exercise_id, reps, sets, exercise_order) " +
    "VALUES (?, " + //workoutId from the insert id returned by insert query
    "?, " + //exerciseId
    "?, ?, ? " + //reps, sets, exerciseOrder
    ");";

    let maxQuery = {
        text: maxOrderQuery,
        placeholder_arr: [req.body.workoutId]
    };

    parameterQuery(maxQuery)
    .then((row) => {
        let max = row[0].max;

        //if this is inserted into middle of current workout order
        //then increment all exerciseOrder above
        if (req.body.exerciseOrder <= max)
        {
            let i = max;
            /*
            * Iterate through max -> exerciseOrder and adjust
            * exercise_order up for each item for workout_id
            */
            promiseWhile(function(){
                return i >= req.body.exerciseOrder;
            },function(){
                return new RSVP.Promise(function(resolve, reject){
                    setTimeout(function(){
                        let incOrderNum = {
                            text: queryText,
                            placeholder_arr: [i+1, req.body.workoutId, i],
                        };
                        i--;
                        resolve(parameterQuery(incOrderNum));
                    },200);
                });
            })
            //after we've incremented to make space, insert the new exercise
            .then(() => {
                let insertQuery = {
                    text: queryText2,
                    placeholder_arr: [req.body.workoutId, req.body.exerciseId, 
                        req.body.repCount, req.body.setCount, req.body.exerciseOrder],
                };
                return parameterQuery(insertQuery)
                //finally get refreshed data and send it back as the post response  
                .then(() => {
                    successCallback(workoutSummary, res)})
                .catch(errorCallback);
            });
        }
        //otherwise just add on new exercise to the end
        else 
        {
            let addEndQuery = {
                text: queryText2,
                placeholder_arr: [req.body.workoutId, req.body.exerciseId, 
                    req.body.repCount, req.body.setCount, max + 1],
            };
            parameterQuery(addEndQuery)
            .then(() => successCallback(workoutSummary, res)).catch(errorCallback);
        }
    })
});

/*********************************************************
/deleteWorkoutExercise' handle:  
Deletes exercise from a workout
Receives: id to delete (Workouts_Exercises.id)
Returns: all rows from that table
*********************************************************/
app.post('/deleteWorkoutExercise', function(req,res,error){

    let workout_id = parseInt(req.body.id);
    let workout_exercise_id = parseInt(req.body.workout_exercise_id);
    let exerciseOrder = parseInt(req.body.exerciseOrder);

    let maxOrderQuery = "SELECT max(exercise_order) as max FROM Workouts_Exercises " +
        "WHERE workout_id = ?;";

    let queryText = "DELETE FROM Workouts_Exercises WHERE id = ?;";

    let decQuery = "UPDATE Workouts_Exercises SET exercise_order = ? " +
    "WHERE workout_id = ? AND exercise_order = ?;";

    var maxQuery = {
        text : maxOrderQuery,
        placeholder_arr : workout_id,
    };

    var deleteQuery = {
        text : queryText,
        placeholder_arr : workout_exercise_id,
    };

    parameterQuery(maxQuery)
    .then((row) => {
        let max = row[0].max;

        //if we only have 1 exercise in workout send error
        //cannot delete last exercise from workout
        if (max == 1)
        {
            res.send(JSON.stringify(
                {
                    failure: true,
                }
            ));
        }

        //if this is deleted from middle of current workout order
        //then decrement all exerciseOrder above
        else if (exerciseOrder < max)
        {
            let i = exerciseOrder + 1;
            /*
            * Iterate through max -> exerciseOrder and adjust
            * exercise_order up for each item for workout_id
            */
            promiseWhile(function(){
                return i <= max;
            },function(){
                return new RSVP.Promise(function(resolve, reject){
                    setTimeout(function(){
                        let decOrderNum = {
                            text: decQuery,
                            placeholder_arr: [i-1, workout_id, i],
                        };
                        i++;
                        resolve(parameterQuery(decOrderNum));
                    },200);
                });
            })
            //after we've decremented all other exercises, delete the exercise
            .then(() => {
                parameterQuery(deleteQuery)
                //finally get refreshed data and send it back as the post response  
                .then(() => {
                    successCallback(workoutSummary, res)})
                .catch(errorCallback);
            });
        }
        //otherwise just add on new exercise to the end
        else 
        {
        parameterQuery(deleteQuery)
        .then(() => successCallback(workoutSummary, res)).catch(errorCallback);
        }
    })
});

/*********************************************************
/insertExercise handle:  
Inserts a exercise into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertExercise', function(req,res,error){

    let checkQuery = "SELECT id FROM Exercises WHERE lower(name) = lower(?);";

    let check1 = {
        text: checkQuery,
        placeholder_arr: [req.body.exerciseName], 
    };

    let successQuery = "SELECT * FROM Exercises;";

    let queryText = "INSERT INTO Exercises (name) " +
        "VALUES (?);"; //exerciseName

    let queryText2 = "INSERT INTO Exercises_MuscleGroups (exercise_id, musclegrp_id) " +
        "VALUES (?, " + //exerciseId
	    "?);"; //muscleId

    let query1 = {
        text : queryText,
        placeholder_arr : [req.body.exerciseName],
    };
    
    //check if we already have name in database, if so don't add again
    parameterQuery(check1)
    .then((response) => {
        //if we do not have the data, then response.length == 0 so insert
        if (response.length == 0){
            //insert into Exercises
            parameterQuery(query1)
            //then insert into Exercises_MuscleGroups
            .then((row) => {
                var query2 = {
                    text : queryText2,
                    placeholder_arr : [row.insertId, req.body.muscleGrpId],
                };
                return parameterQuery(query2)})
            .then(() => successCallback(successQuery, res)).catch(errorCallback);
        }
        //otherwise don't insert the data and return back a failure
        else {
            res.send(JSON.stringify(
                {
                    failure: true,
                }
            ));
        }
    })
});

/*********************************************************
/getWorkoutsUsers handle:  
Grabs all the data from the table (based on the passed
table name from the query string) and returns to the client.
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.get('/getWorkoutsUsers', async function(req,res,next){

    //query returns workout id, workout name, user name, exercise names,
    //sets, reps, exercise order, and the total # of exercises in workout

    //execute the query and the send the results back to the client
    executeQuery(workoutUsers, function(context){
        res.send(context);
    });
});

/*********************************************************
/getExercises_MuscleGroups handle:  
Grabs all the data from the table (based on the passed
table name from the query string) and returns to the client.
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.get('/getExercises_MuscleGroups', async function(req,res,next){

    //query exercisesMuscleGroups returns exercise id and workout id by name

    //execute the query and the send the results back to the client
    executeQuery(exercisesMuscleGroups, function(context){
        // console.log("context", context);
        res.send(context);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
  
  const port = process.env.PORT || 5000;
  app.listen(port);
  
  console.log(`Workout Wizard listening on ${port}`);


/*********************************************************
/insertMuscleGroup handle:  
Inserts a muscle group into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertMuscleGroup', function(req,res,error){

    let checkQuery = "SELECT id FROM Muscle_Groups WHERE lower(name) = lower(?);";

    let check1 = {
        text: checkQuery,
        placeholder_arr: [req.body.muscleGroupName], 
    };

    let successQuery = "SELECT * FROM Muscle_Groups;";

    let queryText = "INSERT INTO Muscle_Groups (name) " +
        "VALUES (?);"; //muscleGroupName

    let query1 = {
        text : queryText,
        placeholder_arr : [req.body.muscleGroupName],
    };
    
    //check if we already have muscle group name in database, if so don't add again
    parameterQuery(check1)
    .then((response) => {
        //if we do not have the data, then response.length == 0 so insert
        if (response.length == 0){
            //insert into Muscle_Groups
            parameterQuery(query1)
            .then(() => successCallback(successQuery, res)).catch(errorCallback);
        }
        //otherwise don't insert the data and return back a failure
        else {
            res.send(JSON.stringify(
                {
                    failure: true,
                }
            ));
        }
    })
});


/*********************************************************
/insertUser handle:  
Inserts a user into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertUser', function(req,res,error){

    let checkQuery = "SELECT id FROM Users WHERE lower(email) = lower(?);";

    let check1 = {
        text: checkQuery,
        placeholder_arr: [req.body.email], 
    };

    let successQuery = "SELECT * FROM Users;";

    let queryText = "INSERT INTO Users (first_name, last_name, email, created_at) " +
    "VALUES (?, " + // firstName
    "?, " + // lastName
    "?, " + // email
    "now()" + // created_at
    ");";

    let query1 = {
        text : queryText,
        placeholder_arr: [req.body.firstName, req.body.lastName, req.body.email], 
    };
    
    //check if we already have email in database, if so don't add again
    parameterQuery(check1)
    .then((response) => {
        //if we do not have the data, then response.length == 0 so insert
        if (response.length == 0){
            //insert into Users
            parameterQuery(query1)
            .then(() => successCallback(successQuery, res)).catch(errorCallback);
        }
        //otherwise don't insert the data and return back a failure
        else {
            res.send(JSON.stringify(
                {
                    failure: true,
                }
            ));
        }
    })
});

/*********************************************************
/insertExercisesMuscleGroups handle:  
Inserts a user into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertExercisesMuscleGroups', function(req,res,error){

    let checkQuery = "SELECT id FROM Exercises_MuscleGroups " +
        "WHERE exercise_id = ? " +
        "AND musclegrp_id = ?;";

    let check1 = {
        text: checkQuery,
        placeholder_arr: [req.body.exerciseID, req.body.muscleGroupID], 
    };

    let queryText = "INSERT INTO Exercises_MuscleGroups (exercise_id, musclegrp_id) " +
        "VALUES (?, " + //exerciseId
        "?);"; //muscleId
    
    let query1 = {
        text : queryText,
        placeholder_arr: [req.body.exerciseID, req.body.muscleGroupID]
    };

    parameterQuery(check1)
    .then((response) => {
        if(response.length == 0){
            // insert into exercise_musclegroups
            parameterQuery(query1)
            .then(() => successCallback(exercisesMuscleGroups, res)).catch(errorCallback);
        }
        //otherwise don't insert the data and return back a failure
        else {
            res.send(JSON.stringify(
                {
                    failure: true,
                }
            ));
        }
    })
});


/*********************************************************
/searchUser handle:  
Searches database for similar users with LIKE query
Receives: nothing
Returns: all rows LIKE search parameter if similar exists.
*********************************************************/
app.post('/searchUser', function(req,res,error){


    // let checkQueryText = "SELECT id FROM Users " +
    // "WHERE lower(first_name) = lower(?) " +
    // "OR lower(last_name) = lower(?) " +
    // "OR lower(email) = lower(?);";
 
    // let checkQuery = {
    //     text: checkQuery,
    //     placeholder_arr: [req.body.searchParameter, req.body.searchParameter, req.body.searchParameter] 
    // };

    let checkQueryText = "SELECT id FROM Users " +
    "WHERE lower(first_name) LIKE lower(?) " +
    "OR lower(last_name) LIKE lower(?) " +
    "OR lower(email) LIKE lower(?);";

    let checkQuery = {
        text: checkQueryText,
        placeholder_arr: ['%' + req.body.searchParameter + '%', '%' + req.body.searchParameter + '%', '%' + req.body.searchParameter + '%'] 
    };

    // let queryText = "SELECT * FROM Users " +
    // "WHERE lower(first_name) = lower(?) " +
    // "OR lower(last_name) = lower(?) " +
    // "OR lower(email) = lower(?);";

    // let query1 = {
    //     text : queryText,
    //     placeholder_arr: [req.body.searchParameter, req.body.searchParameter, req.body.searchParameter] 
    // };

    let returnQueryText = "SELECT * FROM Users " +
    "WHERE lower(first_name) LIKE lower(?) " +
    "OR lower(last_name) LIKE lower(?) " +
    "OR lower(email) LIKE lower(?);";
    
    let returnQuery = {
        text : returnQueryText,
        placeholder_arr: ['%' + req.body.searchParameter + '%', '%' + req.body.searchParameter + '%', '%' + req.body.searchParameter + '%'] 
    };
    
    //check if we have something similar in the database, if we do, proceed
    parameterQuery(checkQuery)
    .then((response) => {
        //if we have data, response != 0
        if (response.length != 0){
            // // catch? 
            // parameterQuery(checkQuery)
            // .then(() => successCallbackParameter(returnQuery, res)).catch(errorCallback);
            
            successCallbackParameter(returnQuery, res);
        }
        //otherwise return back a failure
        else {
            res.send(JSON.stringify(
                {
                    failure: true,
                }
            ));
        }
    })
});