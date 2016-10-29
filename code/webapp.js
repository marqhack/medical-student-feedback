var express = require('express');
var bodyParser = require('body-parser');
var db = require('./dbhandler');
var path = require("path");
var app = express();
var api = express();
api.use(bodyParser.json( { type: '*/*' })); 

// Object returned by call
// returns an array of epa objects
/*api.get('/epalist', function(req, res){
    var epalist = [
        { name: "EPA 1", questions: [ { prompt: "The student greeted the patient in a kind, yet professional manner." }, { prompt: "The student used medical jargon when apppropriate." }, { prompt: "Question 1.3" }, { prompt: "Question 1.4" }, { prompt: "Question 1.5" }] }, 
        { name: "EPA 2", questions: [ { prompt: "Question 2.1" }, { prompt: "Question 2.2" }, { prompt: "Question 2.3" }, { prompt: "Question 2.4" }, { prompt: "Question 2.5" }] },  
        { name: "EPA 3", questions: [ { prompt: "Question 3.1" }, { prompt: "Question 3.2" }, { prompt: "Question 3.3" }, { prompt: "Question 3.4" }, { prompt: "Question 3.5" }] }
    ]
    console.log(epalist)
    res.json(epalist);
}); */






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

app.use('/api', api)
app.use(express.static('static'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
