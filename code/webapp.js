var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");
var app = express();
var api = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('medFeedback.db');


db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS students (pid INT, name TEXT)");
    var stmt = db.prepare("INSERT INTO students VALUES (?, ?)");
    for(var i = 0; i< 10; i++){
        var n = "name";
        stmt.run(i, n);
    }
    stmt.finalize();
});

var profData = [
    
];

api.get('/profs', function (req, res) {
    res.send(JSON.stringify(profData));
});

api.post('/profs', function (req, res) {
    var newProf = req.body; 
    profData.push(newProf); 
    
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

//App root
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/static/index.html'));
});

//App login page
app.get('/login', function(req, res){
    res.send("You've reached the login page");
});


//App admin page
app.get('/admin', function(req, res){
    res.sendFile(path.join(__dirname+'/static/admin.html'));
});

//API root
api.use(bodyParser.json( { type: '*/*' })); 
api.get('/', function(req, res){
    res.send("This is the API! Congrats");
});


app.use('/api', api)
app.use(express.static('static'));
