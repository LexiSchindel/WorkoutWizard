const express = require('express');
const path = require('path');
var mysql = require('./dbcon.js');
const env = require('dotenv').config();
var cors = require('cors')

const app = express();
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
        // console.log("context", context);
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

    //query returns workout id, workout name, user name, exercise names,
    //sets, reps, exercise order, and the total # of exercises in workout
    let query = "select " +
    "ww.id, " +
    "ww.name as workout_name, " +
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

    //execute the query and the send the results back to the client
    executeQuery(query, function(context){
        // console.log("context", context);
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

    let queryText = "INSERT INTO Workouts (name, created_at, updated_at, user_id) " +
    "VALUES (?, now(), now(), ?);"

    let queryText2 = "INSERT INTO Workouts_Exercises (workout_id, exercise_id, sets, reps, exercise_order) " +
        "VALUES (?, " + //workoutId from the insert id returned by insert query
        "?, " + //exerciseId
        "?, ?, 1 " + //sets, reps, exerciseOrder
        ");"

    var query1 = {
        text : queryText,
        placeholder_arr : [req.body.workoutName, req.body.User],
    };

    parameterQuery(query1)
    .then((row) => {
        var query2 = {
            text : queryText2,
            placeholder_arr : [row.insertId, req.body.exerciseId, req.body.setCount, req.body.repCount],
        };
        parameterQuery(query2)})
        .then(successCallback).catch(errorCallback);

    function successCallback(){
        let query = "select " +
        "ww.id, " +
        "ww.name as workout_name, " +
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

        //execute the query and the send the results back to the client
        executeQuery(query, function(context){
            // console.log("context", context);
            res.send(context);
        });
      }
    function errorCallback(err){
        console.log('Error while executing SQL Query',err);
      }
});

/*********************************************************
/insertExercise' handle:  
Inserts a exercise into the database
Receives: nothing
Returns: all rows from that table
*********************************************************/
app.post('/insertExercise', function(req,res,error){

    let checkQuery = "SELECT id FROM Exercises WHERE lower(name) = lower(?);"

    let check1 = {
        text: checkQuery,
        placeholder_arr: [req.body.exerciseName], 
    };

    let queryText = "INSERT INTO Exercises (name) " +
        "VALUES (?);" //exerciseName

    let queryText2 = "INSERT INTO Exercises_MuscleGroups (exercise_id, musclegrp_id) " +
        "VALUES (?, " + //exerciseId
	    "?);" //muscleId

    let query1 = {
        text : queryText,
        placeholder_arr : [req.body.exerciseName],
    };
    
    //check if we already have name in database, if so don't add again
    parameterQuery(check1)
    .then((response) => {
        if (response.length == 0){
            parameterQuery(query1)
            .then((row) => {
                var query2 = {
                    text : queryText2,
                    placeholder_arr : [row.insertId, req.body.muscleGrpId],
                };
                parameterQuery(query2)})
                .then(successCallback).catch(errorCallback);
        }
    })
    

    function successCallback(){
        let query = "SELECT * FROM Exercises;";

        //execute the query and the send the results back to the client
        executeQuery(query, function(context){
            res.send(context);
        });
      }
    function errorCallback(err){
        console.log('Error while executing SQL Query',err);
      }
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
    let query = "select " +
    "ww.id, " +
    "ww.name as workout_name, " +
    "CONCAT(uu.first_name, ' ', uu.last_name) as user_name, " +
    "COUNT(distinct we.id) as total_exercises " +
    
    "from workouts ww " +
    "left join workouts_exercises we on we.workout_id = ww.id " +
    "left join users uu on uu.id = ww.user_id " +

    "group by 1,2,3 " +
    
    "order by ww.id" +
    ";";

    //execute the query and the send the results back to the client
    executeQuery(query, function(context){
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

    //query returns workout id, workout name, user name, exercise names,
    //sets, reps, exercise order, and the total # of exercises in workout
    let query = "SELECT " +
    "emg.id, " +
    "ee.name as exercise_name, " +
    "mg.name as musclegrp_name " +
    
    "FROM exercises_musclegroups emg " +
    "JOIN exercises ee on ee.id = emg.exercise_id " +
    "JOIN muscle_groups mg on mg.id = emg.musclegrp_id " +
    "ORDER BY emg.id ASC" +
    ";";

    //execute the query and the send the results back to the client
    executeQuery(query, function(context){
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