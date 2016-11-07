var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("medfeedback.db");

/**
 * Intialize the database, creating the tables if they do not already exist. 
 */
function initdb() {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS Students(pid INTEGER PRIMARY KEY AUTOINCREMENT, name STRING NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Evaluators(evid INTEGER PRIMARY KEY AUTOINCREMENT, name STRING NOT NULL, email STRING NOT NULL, UNIQUE(email))");
        db.run("CREATE TABLE IF NOT EXISTS EPAs(epaNum INTEGER PRIMARY KEY, activity STRING NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Activities(aNum INTEGER PRIMARY KEY AUTOINCREMENT, aContent STRING NOT NULL, UNIQUE(aContent))");
        db.run("CREATE TABLE IF NOT EXISTS Survey(epaNum INTEGER, aNum INTEGER, FOREIGN KEY(epaNum) REFERENCES EPAs, FOREIGN KEY(aNum) REFERENCES Activities, PRIMARY KEY(epaNum, aNum))");
        db.run("CREATE TABLE IF NOT EXISTS Assessments(aid INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, evid INTEGER, aNum INTEGER, score INTEGER, created DATE NOT NULL, completed DATE DEFAULT NULL, FOREIGN KEY(pid) REFERENCES Students, FOREIGN KEY(evid) REFERENCES Evaluators, FOREIGN KEY(aNum) References Activities, UNIQUE(pid, evid, aNum, completed))");
        //db.run("CREATE TABLE IF NOT EXISTS Responses(rid INTEGER PRIMARY KEY AUTOINCREMENT, aid INTEGER, score INTEGER, FOREIGN KEY(aid) REFERENCES Assessments, UNIQUE(aid))");
        db.run("CREATE TABLE IF NOT EXISTS Comments(aid INTEGER PRIMARY KEY, comment STRING NOT NULL, FOREIGN KEY(aid) REFERENCES Assessments)");
    });
}

/**
 * Function that adds a brand new EPA along with its set of questions to the database. 
 *
 * INPUT>>A json object with the following format: json['epaNum'] = epa#, json['name'] = epaName,
 *     json['description'] = epaDescription, json['q1'] = q1, json['q2'] = q2,..., json['qn'] = qn 
 * ERRORS>>1-The EPA number already exists in the EPA table, 
 *         2-The same question (having the same characters when capitalized) is repeated in the same EPA. 
 *         A survey cannot contain the same question twice.
 *         3-A question for the new EPA is already in the Questions table. Due to EPAs sharing the same ques-
 *         tions, this error is only reported to the console (for now) and the index for the same question
 *         already in the database is used instead, thus keeping a unique set of questions from which to po-
 *         pulate.  
 *
 * Errors can be handled via events.     
 */
function addEpaWithQuestions(json) {
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO EPAs VALUES (?, ?)");
        var run = stmt.run(json['epaNum'], json['activity'], function callback(err) {
            if(err != undefined && err['errno'] == 19)
                console.log("Error: There is already an EPA numbered %d. A solution is to possibly update the EPA info.", json['epaNum']);
            else if(err != undefined && err['errno']!= 19) 
                console.log("An unknown (for now) error has occured. Please restart the application in a couple of minutes.", json['epaNum']);
            else {
                stmt.finalize();
                addQuestions(json);
            }
        });
        
        function addQuestions(json) {    
            var counter = 0;
            var qArray = [];
            var questions = "SELECT A.aNum FROM Activities A WHERE A.aContent='";
            for(name in json) {
                if(counter > 1) {
                    qArray.push(json[name]);
                    questions = questions + json[name] + "'";
                    if(counter < (count = Object.keys(json).length) - 1)  
                        questions = questions + " OR A.aContent='";
                    db.serialize(function() {
                        var stmt = db.prepare("INSERT INTO Activities(aContent) VALUES(?)");
                        var run = stmt.run(json[name], function callback(err) {
                            if(err) {
                                console.log("Error: Repeated Question. Due to numerous EPAs sharing questions, this error can be ignored.");              // will need to figure out error handling, perhaps an event?
                            }
                        
                        }); 
                        stmt.finalize();
                    }); 
                }
                counter++;
            }
            buildSurvey(json['epaNum'], qArray, questions, json);
        }

        function buildSurvey(epa, qArray, questions, json) {
            db.each(questions, function(err, row) {
                db.serialize(function() {
                    var stmt = db.prepare("INSERT INTO Survey VALUES(?, ?)");
                    var run = stmt.run(epa, row['aNum'], function callback(err) {
                        if(err) {
                            console.log("Error: Repeated Question. Due to numerous EPAs sharing questions, this error can be ignored.");              // will need to figure out error handling, perhaps an event?
                        }                
                    }); 
                }); 
            });
        } 
    });   
}

/**
 * Add a question to an existing EPA. Fails if the EPA # isn't already in the database, or if the EPA already has the question. 
 */
function addQuestionToEPA(json) {
    epaNum = json['epaNum'];
    db.serialize(function() { 
        db.all("SELECT epaNum FROM EPAs WHERE epaNum=?", epaNum, function(err, rows) {
            if(rows.length == 0)
                console.log("Error: The EPA is not yet in the database. Please create it before attempting to insert questions to it.");
            else {
                db.serialize(function() { 
                    db.all("SELECT aNum FROM Activities WHERE aContent=?", json['question'], function(err, rows) {
                        if(rows.length == 0)  
                            addNewQuestion(json);
                        else 
                            buildSurvey(json['epaNum'], rows[0].aNum);
                    });
                });
            }
        });

        function addNewQuestion(json) {
            db.serialize(function() { 
                var stmt = db.prepare("INSERT INTO Activities(aContent) VALUES(?)");
                var run = stmt.run(json['question'], function callback(err) { 
                    if(err != undefined && err['errno'] == 19) {}
                    else if(err != undefined)
                        console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes."); 
                });
            });
            db.serialize(function() { 
                db.all("SELECT aNum FROM Activities WHERE aContent=?", json['question'], function(err, rows) {
                    buildSurvey(json['epaNum'], rows[0].aNum);
                });
            });
        }

        function buildSurvey(epaNum, aNum) {
            db.serialize(function() {
                var stmt = db.prepare("INSERT INTO Survey VALUES(?, ?)");
                var run = stmt.run(epaNum, aNum, function callback(err) {
                    if(err != undefined && err['errno'] == 19) 
                        console.log("Error: The question already exists for EPA#%d.", epaNum);
                    else if(err != undefined)
                        console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes.");          
                });
            });
        }
    });
}

/**
 *  Add to the Students table. 
 */
function addStudent(name) {
    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Students(name) VALUES(?)");
        var run = stmt.run(name, function callback(err) {
            // no known errors should occur when inserting to Students
            if(err) 
                console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes.");  
        });
    });
}

/**
 *  Add to the Evaluators table. 
 */
function addEvaluator(json) {
    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(name, email) VALUES(?, ?)");
        var run = stmt.run(json['name'], json['email'], function callback(err) {
            // error if email is repeated
            if(err) 
                console.log("Error: Evaluator %s is already in the database.", json['name']);  
        });
    });
}

/**
 *  Input: json['pid'] = pid, json['evid'], json['aNum']
 */
function logAssessment(json) {
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
    
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO Assessments(pid, evid, aNum, created) VALUES(?, ?, ?, ?)");
        var run = stmt.run(json['pid'], json['evid'], json['aNum'], currentdate,  function callback(err) {
            if(err) {
                console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes.");  
                console.log(err);
            }
        });
    });
}

/**
 *  Given an aid and score, update the respective entry in the assessments table. An error will occur if the entry
 *  is a duplicate (a duplicate is defined as the same student being evaluated on the same EPA more than once by the same
 *  evaluator in a given day). 
 */
function logResponse(aid, score) {
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
    db.serialize(function() {
        var stmt = db.prepare("UPDATE Assessments SET score=?, completed=? WHERE aid=?");
        var run = stmt.run(score, currentdate, aid, function callback(err) {
            if(err) {
                console.log("Error: Duplicate Assessment.");  
                //console.log(err);
            }
        });
        stmt.finalize();            
    });
}



/**
 * Returns the database object so that it can be used to display the database 
 */
function getDB() {
    return db;
}

// function to test things :)
function test(j) {
    var count = Object.keys(j).length;
    console.log(count)     
}

module.exports.addEpaWithQuestions = addEpaWithQuestions;
module.exports.getDB = getDB;
module.exports.initdb = initdb;
module.exports.addQuestionToEPA = addQuestionToEPA;
module.exports.addStudent = addStudent;
module.exports.addEvaluator = addEvaluator;
module.exports.logAssessment = logAssessment;
module.exports.logResponse = logResponse;