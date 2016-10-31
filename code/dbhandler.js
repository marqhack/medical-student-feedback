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
        db.run("CREATE TABLE IF NOT EXISTS Questions(qNum INTEGER PRIMARY KEY AUTOINCREMENT, qContent STRING NOT NULL, UNIQUE(qContent))");
        db.run("CREATE TABLE IF NOT EXISTS Survey(epaNum INTEGER, qNum INTEGER, FOREIGN KEY(epaNum) REFERENCES EPAs, FOREIGN KEY(qNum) REFERENCES QUESTIONS, PRIMARY KEY(epaNum, qNum))");
        db.run("CREATE TABLE IF NOT EXISTS Assessments(aid INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, evid INTEGER, epaNum INTEGER, created DATE NOT NULL, completed DATE DEFAULT NULL, FOREIGN KEY(pid) REFERENCES Students, FOREIGN KEY(evid) REFERENCES Evaluators, FOREIGN KEY(epaNum) References EPAs, UNIQUE(pid, evid, epaNum, completed))");
        db.run("CREATE TABLE IF NOT EXISTS Responses(rid INTEGER PRIMARY KEY AUTOINCREMENT, aid INTEGER, qid INTEGER, score INTEGER, FOREIGN KEY(aid) REFERENCES Assessments, FOREIGN KEY(qid) REFERENCES Questions, UNIQUE(aid, qid))");
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
            var questions = "SELECT Q.qNum FROM Questions Q WHERE Q.qContent='";
            for(name in json) {
                if(counter > 1) {
                    qArray.push(json[name]);
                    questions = questions + json[name] + "'";
                    if(counter < (count = Object.keys(json).length) - 1)  
                        questions = questions + " OR Q.qContent='";
                    db.serialize(function() {
                        var stmt = db.prepare("INSERT INTO Questions(qContent) VALUES(?)");
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
                    var run = stmt.run(epa, row['qNum'], function callback(err) {
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
                    db.all("SELECT qNum FROM Questions WHERE qContent=?", json['question'], function(err, rows) {
                        if(rows.length == 0)  
                            addNewQuestion(json);
                        else 
                            buildSurvey(json['epaNum'], rows[0].qNum);
                    });
                });
            }
        });

        function addNewQuestion(json) {
            db.serialize(function() { 
                var stmt = db.prepare("INSERT INTO Questions(qContent) VALUES(?)");
                var run = stmt.run(json['question'], function callback(err) { 
                    if(err != undefined && err['errno'] == 19) {}
                    else if(err != undefined)
                        console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes."); 
                });
            });
            db.serialize(function() { 
                db.all("SELECT qNum FROM Questions WHERE qContent=?", json['question'], function(err, rows) {
                    buildSurvey(json['epaNum'], rows[0].qNum);
                });
            });
        }

        function buildSurvey(epaNum, qNum) {
            db.serialize(function() {
                var stmt = db.prepare("INSERT INTO Survey VALUES(?, ?)");
                var run = stmt.run(epaNum, qNum, function callback(err) {
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
            // no known errors should occur when inserting to Evaluators
            if(err) 
                console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes.");  
        });
    });
}

/**
 *
 */
function logAssessment(json) {
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-" + currentdate.getDate();
    
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO Assessments(pid, evid, epaNum, created) VALUES(?, ?, ?, ?)");
        var run = stmt.run(json['pid'], json['evid'], json['epaNum'], currentdate,  function callback(err) {
            // no known errors should occur when inserting to Evaluators
            if(err) {
                console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes.");  
                console.log(err);
            }
        });
    });
}

/**
 *
 */
function logResponses(json) {

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