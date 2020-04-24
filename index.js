const express = require('express');
const path = require('path');
var mysql = require('./dbcon.js');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Workout Wizard listening on ${port}`);