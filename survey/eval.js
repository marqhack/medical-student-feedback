var mysql = require('mysql')
var express = require('express');
var path = require('path');
var fs = require('fs'); 
var router = express.Router(); 
var db = require('./dbhandler');
var nodemailer = require('nodemailer'); 
/* GET home page. */

router.use(express.static( path.join(__dirname,'static') ));

// Send home page
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/static/survey.html')); 
});

// Functions for database interactions
router.get('/test', db.getActivities);
router.get('/verfEmail', db.checkEmail);
router.get('/fetchActWithChoices', db.getActivityWithChoices);
router.get('/getSurvey', db.getSurvey);
router.get('/getPatientQuestions', db.getPatientQuestions);
router.post('/addEvaluator', db.addEvaluator);
router.post('/logAssessment', db.logAssessment);

//nodemailer email functionality
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: { 
        user: "kcirsbboh@gmail.com",
        pass: "thepasswordispassword"
    }   
});
router.get('/sendEmail', function(req, res){
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
 







module.exports = router; 
