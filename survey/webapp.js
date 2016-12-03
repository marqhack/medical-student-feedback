var express = require('express');
var nodemailer = require('nodemailer');

//currently sending email from Gmail
//needs to be setup to send from server
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: { 
        user: "kcirsbboh@gmail.com",
        pass: "thepasswordispassword"
    }
});

var bodyParser = require('body-parser');
var db = require('./dbhandler');
var path = require("path");
var app = express.Router();

app.use(bodyParser.json( { type: '*/*' })); 


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


app.get('/test', db.getActivities);
app.get('/verfEmail', db.checkEmail);
app.get('/fetchActWithChoices', db.getActivityWithChoices);
app.get('/getSurvey', db.getSurvey);
app.get('/getStudentName', db.getNameByPID);
app.post('/addEvaluator', db.addEvaluator);
app.post('/logAssessment', db.logAssessment);

// format: json['epaNum'] = epa#, json['qNum'] = q#, json['qContent'] = question content
app.get('/epalist', function(req, res){
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

app.post('/epalist', function(req, res){
    var stmt = db.prepare("UPDATE medFeedback INSERT INTO students VALUES(?, ?)");
    stmt.run(row.pid + 1, "name");
    stmt.finalize();


    /*input = req.jsonObject;

    // pass to function in dbhandler
    db.addEPAWithQuestions(input);*/
}); 

var profData = [
    
];

app.get('/profs', function (req, res) {
    res.send(JSON.stringify(profData));
});

app.post('/profs', function (req, res) {
    var newProf = req.body; 
    profData.push(newProf); 
    
});









//App admin page
app.get('/admin', function(req, res){
    res.sendFile(path.join(__dirname+'/static/admin.html'));
});


//API root
app.use(bodyParser.json( { type: '*/*' })); 

 
// app.use('/api', api);
//app.use(express.static( path.join(__dirname+'static') ));
app.use(express.static( 'static' ));



//nodemailer email functionality
app.get('/sendEmail', function(req, res){
    var mailOptions = {
        to: req.query.to,
        subject: req.query.subject,
        text: req.query.text
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});

module.exports = app;
