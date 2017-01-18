//API calls for RESTful interface
//Contributions from Nick, Grant, Tommy, Matthew

var mysql = require('mysql')
var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer();

var con = mysql.createConnection({
  host: 'mydb.cs.unc.edu', 
  user: 'granthum',
  password: 'CH@ngemenow99Please!granthum',
  database: 'medtrackdb'
});

con.connect(function(err){
  if(err){
    console.log("Connection error with sql");
    console.log(err);
    return;
  }
  console.log("Connection established");
  return;
});

//GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//GET request that returns a json object of the checklist items for mastery in a given EPA
router.get('/epa/:epa', function(req,res) {
  var epaDetails = JSON.parse(fs.readFileSync('assets/epa-details-list.json', 'utf8'));
  res.json(epaDetails.EPAs[req.params.epa-1])
});

//GET request that returns details of the most recent 10 examinations for a given student and EPA
router.get('/tests/:id/:epa', function(req,res){
  con.query('SELECT * FROM EPAHistory  WHERE student = ? AND epaid = ? ORDER BY examdate desc', [req.params.id,req.params.epa], function(err, rows, fields)
  {
    if(err){
      console.log('Connection result error '+err);
    }
    else{
      //console.log('no of records is '+rows.length);
      res.set({'Content-Type':'text/json'});
      res.send(JSON.stringify(rows));
    }
  });
});

//GET request that returns all comments for a given examination
router.get('/comments/:hid', function(req, res){
  con.query('SELECT body, hid FROM UpdateComments WHERE hid = ?', req.params.hid, function(err, rows, fields){
    if(err){
      console.log('Connection result error '+err);
    }
    else{
      //console.log('no of records is '+rows.length);
      res.set({'Content-Type':'text/json'});
      res.send(JSON.stringify(rows));
    }
  });
});

//GET request that returns information about a given user
router.get('/users/:id', function(req,res){
  con.query('SELECT fname, lname, year, email, permissions FROM Users WHERE uid = ?', req.params.id, function(err, rows, fields)
  {
    if(err){
      console.log('Connection result error '+err);
    }
    else{
      //console.log('no of records is '+rows.length);
      res.set({'Content-Type':'text/json'});
      res.send(JSON.stringify(rows));
    }
  });
});

//GET request that returns the detals of the most recent exams for each of a student's EPAs
router.get('/student/:id/summary', function(req,res){
  con.query('select H.* from `EPAHistory` H left outer join `EPAHistory` E on E.epaid=H.epaid and E.student=H.student and H.examdate<E.examdate where E.examdate is null and H.student=?', req.params.id, function(err, rows, fields)
  {
    if(err){
      console.log('Connection result error '+err);
    }
    else{
      //console.log('no of records is '+rows.length);
      res.set({'Content-Type':'text/json'});
      res.send(JSON.stringify(rows));
    }
  });
});

//GET request that returns all advisees of a given adviser
router.get('/adviser/:id/advisees', function(req,res){
  con.query('SELECT fname, lname, email, uid, year FROM Users u WHERE u.adviserid = ?', req.params.id, function(err, rows, fields)
  {
    if(err){
      console.log('Connection result error '+err);
    }
    else{
      //console.log('no of records is '+rows.length);
      res.set({'Content-Type':'text/json'});
      res.send(JSON.stringify(rows));
    }
  });
});

//POST request that creates a new adviser in the database
//Expects username, email, fname, lname parameters in the request body
//Returns the new adviser's uid on success
router.post('/new/adviser', upload.array(), function(req, res){
  var body = req.body;
  con.query('INSERT INTO Users (username, email, fname, lname, permissions, year) VALUES (?, ?, ?, ?, ?, ?)', [body.username, body.email, body.fname, body.lname, 1, 0], function(err, rows, fields){
    if(err){
      res.send("Fail1, " + err);
    }
    else{
      con.query('SELECT uid FROM Users WHERE username=?', [body.username], function(err2, rows2, fields2){
        if(err2){
          res.send("Fail2, " + err2)
        }
        else{
          var uid = JSON.stringify(rows2)
          res.send(uid);
        }
      });
    }
  });
});

//POST request that creates a new student in the database
//Expects username, email, fname, lname, adviserid, year parameters in the request body
//Returns the new student's uid on success
router.post('/new/student', upload.array(), function(req, res){
  var body = req.body;
  con.query('INSERT INTO Users (uid, username, email, fname, lname, permissions, adviserid, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [body.uid, body.username, body.email, body.fname, body.lname, 0, body.adviserid, body.year], function(err, rows, fields){
    if(err){
      res.send("Fail1, " + err);
    }
    else{
      con.query('SELECT uid FROM Users WHERE username=?', [body.username], function(err2, rows2, fields2){
        if(err2){
          res.send("Fail2, " + err2)
        }
        else{
          var uid = JSON.stringify(rows2)
          res.send(uid);
        }
      });
    }
  });
});

//POST request that adds a new examination for a specified student and EPA
//Expects student, epaid, title, examdate, newval, comments parameters in the request body
//Returns 'Success' on success
router.post('/new/exam', upload.array(), function(req, res){
  var body = req.body;
  con.query('INSERT INTO EPAHistory (student, epaid, title, examdate, newval) VALUES (?, ?, ?, ?, ?)', [body.student, body.epaid, body.title, body.examdate, body.newval], function(err, rows, fields){
    if(err){
      res.send("Fail1, " + err);
    }
    else{
      con.query('SELECT hid FROM EPAHistory WHERE student=? AND epaid=? AND title=? AND examdate=? AND newval=?', [body.student, body.epaid, body.title, body.examdate, body.newval], function(err2, rows2, fields2){
        if(err){
          res.send("Fail2, " + err2);
        }
        else{
          var hid = (rows2[0].hid);
          con.query('INSERT INTO UpdateComments (hid, body) VALUES (?, ?)', [hid, body.comments], function(err3, rows3, fields3){
            if(err){
              res.send("Fail3, " + err3);
            }
            else{
              res.send("Success");
            }
          })
        }
      });
    }
  });
});

module.exports = router;
