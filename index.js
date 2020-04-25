const express = require('express');
const path = require('path');
var mysql = require('./dbcon.js');
const env = require('dotenv').config();
var cors = require('cors')

const app = express();

//so we can make requests on local server
app.use(cors())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/*********************************************************
/getTable handle:  
Grabs all the data from the table (based on the passed
table name from the query string) and returns to the client.
Receives: table from query string
Returns: all rows from that table
*********************************************************/
app.get('/getTable', async function(req,res,next){
    let context = {};
    console.log("req: ", req.query.table);
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
        console.log("context", context);
        res.send(context);
    });
});

/*********************************************************
executeQuery: 
Executes the query and returns all the rows
from the results back to the callback which well send to 
the client
Receives: query - query string; callback - callback function
Returns: nothing (sends back rows to callback function)
*********************************************************/
function executeQuery(query, callback){
    console.log("executeQuery");
    mysql.pool.query(query, function(err, rows){
        if(err){
            console.log('error');
            next(err);
        }
        console.log("row: ", rows);
        callback(rows);
    });
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
  
  const port = process.env.PORT || 5000;
  app.listen(port);
  
  console.log(`Workout Wizard listening on ${port}`);


/*********************************************************
This is something I was using to add new tables/rows to the
database.
*********************************************************/
// app.get('/addUsers',function(req,res,next){
//     var context = {};
//     var createString = "CREATE TABLE IF NOT EXISTS Muscle_Groups (" +
//         "id INT(11) AUTO_INCREMENT PRIMARY KEY," +
//         "name VARCHAR(255) NOT NULL" +
//     ");";
//     mysql.pool.query('DROP TABLE IF EXISTS Muscle_Groups', function(err){
//         console.log('delete');
//       if(err){
//         next(err);
//         return;
//       }
//         mysql.pool.query(createString, function(err){
//             console.log('create');
//             if(err){
//                 next(err);
//                 return;
//             }
//             mysql.pool.query("INSERT INTO Muscle_Groups (name)" +
//                 "VALUES ('upper leg')," +
//                 "('lower leg')," +
//                 "('upper arms')," +
//                 "('shoulders')," +
//                 "('lower arms')," +
//                 "('back')," +
//                 "('abdominals');"
//                 ,function(err){
//                 mysql.pool.query('SELECT * FROM Muscle_Groups', function(err, rows, fields){
//                     context.results = JSON.stringify(rows);
//                     console.log("rows: ", context.results);
//                 });
//             });
//         });
//     });
// });