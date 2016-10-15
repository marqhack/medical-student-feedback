var express = require('express');
var bodyParser = require('body-parser');
var db = require('./dbhandler');
var path = require("path");
var app = express();
var api = express();


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


api.use(bodyParser.json( { type: '*/*' })); 
api.get('/epalist', function(req, res){
    var query = db.getDB();
    spillEPAs();

    function spillEPAs() {
        query.all("SELECT * FROM EPAs", function(err, rows){
            res.json(JSON.stringify(rows));
        });
    }
});

api.post('/epalist', function(req, res){
    var stmt = db.prepare("UPDATE medFeedback INSERT INTO students VALUES(?, ?)");
    stmt.run(row.pid + 1, "name");
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

