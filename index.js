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

app.get('/getData', async function(req,res,next){
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

    queryDB(query, function(context){
        console.log("context", context);
        res.send(context);
    });
});

function queryDB(query, callback){
    console.log("queryDB");
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