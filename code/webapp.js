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


api.get('/test', db.getActivities);
api.get('/verfEmail', db.checkEmail);
api.post('/addEvaluator', db.addEvaluator);

// format: json['epaNum'] = epa#, json['qNum'] = q#, json['qContent'] = question content
api.get('/epalist', function(req, res){
    var query = db.getDB();
    spillEPAs();

    function spillEPAs() {
        query.all("SELECT S.epaNum, S.qNum, Q.qContent FROM Survey S, Questions Q WHERE S.qNum = Q.qNum", 
            function(err, rows){

            /*response = "EPA#\t\t" + "q#\t\t" + "Content\n";
            for(index in rows) {
                row = rows[index];
                response += row['epaNum'] + "\t\t\t" + row['qNum'] + "\t\t\t" + row['qContent'] + "\n";
            }*/

            res.send(JSON.stringify(rows));
        });
    }
});

api.post('/epalist', function(req, res){
    var stmt = db.prepare("UPDATE medFeedback INSERT INTO students VALUES(?, ?)");
    stmt.run(row.pid + 1, "name");
    stmt.finalize();


    /*input = req.jsonObject;

    // pass to function in dbhandler
    db.addEPAWithQuestions(input);*/
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
