var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("medfeedback.db");

/**
 * Intialize the database, creating the tables if they do not already exist. 
 */
function initdb() {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS Students(pid INTEGER PRIMARY KEY AUTOINCREMENT, name STRING NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Evaluators(evid INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, email STRING NOT NULL, type STRING, UNIQUE(email))");
        db.run("CREATE TABLE IF NOT EXISTS EPAs(epaNum INTEGER PRIMARY KEY, activity STRING NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Activities(aNum INTEGER PRIMARY KEY AUTOINCREMENT, aContent STRING NOT NULL, choice1 INTEGER, choice2 INTEGER, choice3 INTEGER, choice4 INTEGER, \
                choice5 INTEGER, FOREIGN KEY(choice1, choice2, choice3, choice4, choice5) REFERENCES Response_Choices, UNIQUE(aContent))");
        db.run("CREATE TABLE IF NOT EXISTS Survey(epaNum INTEGER, aNum INTEGER, FOREIGN KEY(epaNum) REFERENCES EPAs, FOREIGN KEY(aNum) REFERENCES Activities, \
                PRIMARY KEY(epaNum, aNum))");
        db.run("CREATE TABLE IF NOT EXISTS Response_Choices(rcNum INTEGER PRIMARY KEY AUTOINCREMENT, rcContent, UNIQUE(rcContent))");
        db.run("CREATE TABLE IF NOT EXISTS Assessments(aid INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, evid INTEGER, aNum INTEGER, score INTEGER, on_device INTEGER, \
                created DATE NOT NULL, completed DATE DEFAULT NULL, FOREIGN KEY(pid) REFERENCES Students, FOREIGN KEY(evid) REFERENCES Evaluators, FOREIGN KEY(aNum) References Activities)");
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

        var qArray = [];
        function addQuestions(json) {    
            var counter = 0;
            //var qArray = [];
            var questions = "SELECT A.aNum FROM Activities A WHERE A.aContent='";
            for(name in json) {
                if(counter > 1) {
                    qArray.push(json[name]);
                    questions = questions + json[name].q + "'";
                    if(counter < (count = Object.keys(json).length) - 1)  
                        questions = questions + " OR A.aContent='";
                    db.serialize(function() {
                        var stmt = db.prepare("INSERT INTO Activities(aContent) VALUES(?)");
                        var run = stmt.run(json[name].q, function callback(err) {
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
            for(index in qArray) {
                bindResponseChoicesToActivity(qArray[index]);
            } 
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
 *
 */
function bindResponseChoicesToActivity(choices) {
    db.serialize(function() {
        db.all("SELECT aNum FROM Activities WHERE aContent=?", choices.q, function(err, rows) {
            //console.log(rows); 
            for(var propt in choices)
                if(propt != "q")
                    addToDb(rows[0].aNum, choices[propt], propt);           
        });
    });

    function addToDb(aNum, choice, choiceNum) {
        db.serialize(function() { 
            var stmt = db.prepare("INSERT INTO Response_Choices(rcContent) VALUES(?)");
            var run = stmt.run(choice, function callback(err) {
                if(err) {
                    //console.log(err);
                }
            });
            stmt.finalize();
        });

        db.serialize(function() {
            db.all("SELECT rcNum FROM Response_Choices WHERE rcContent=?", choice, function(err, rows) {
                var rcNum = rows[0].rcNum;
                var query = "UPDATE Activities SET choice" + choiceNum + "=? WHERE aNum=" + aNum;
                var stmt = db.prepare(query);
                var run = stmt.run(rcNum, function callback(err) {
                    if(err) {
                        //console.log(err);
                    }                     
                });  
                stmt.finalize();
            });
         });
    }
}

/**
 *
 */
function viewEPAs(req, res) {
    db.serialize(function() { 
        db.all("SELECT * FROM EPAs", function(err, rows) {
            res.send(rows);
        });
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
 *  Input: Object with the following properties: 
 *         {activities: [x1, x2,...,x3], pid: #, email: email, on_device: false};
 */
function logAssessment(assessment) {
    var response = [];
    for(i = 0; i < assessment.length; i++) {
        var current = assessment[i];
        for(f = 0; f < current.activities.length; f++)
            enterToDB(current.pid, current.email, current.activities[f], current.on_device ? 1 : 0)
        
    }
    
    function enterToDB(pid, email, aNum, on_device) {
        var currentdate = new Date();
        currentdate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();

        db.all("SELECT evid, type FROM Evaluators WHERE email=?", email, function(err, rows) {
            if(rows != null && rows.length != 0) {
                var evid = rows[0].evid;
                var type = rows[0].type;
                db.serialize(function() {
                    var stmt = db.prepare("INSERT INTO Assessments(pid, evid, aNum, on_device, created) VALUES(?, ?, ?, ?, ?)");
                    var run = stmt.run(pid, evid, aNum, on_device, currentdate,  function callback(err) {
                        if(err) {
                            console.log("An unknown (for now) error has occurred. Please restart the application and try again in a couple of minutes.");  
                            console.log(err);
                        }
                    });
                });             
            }
            else 
              console.log("Error: The email did not match an evaluator in the database.");  
        });        
    }
}

/**
 *  Checks if a given email matches that of an evaluator in the database. 
 *  >>Input: req.query['email']: the requested email adress
 *  >>Output: evid, name, and type of the evaluator. null if an evaluator is not found
 */
function checkEmail(req, res) {
    var email = req.query['email'];
    db.all("SELECT evid, name, type FROM Evaluators WHERE email=?", email, function(err, rows) {
        if(rows.length != 0)
            res.send(JSON.stringify(rows[0]))
        else
            res.send(null);
    });
}

/**
 *  Returns the response choices associated with each activity number listed in the parameter. The name of the
 *  parameters does not matter, but each must have a numeric value indicating an activity number. 
 *  >>Input: activity numbers through the req object
 *  >>Output: array containg activity numbers with their choices, in ascending numerical number of activities,
 *            having the following format: [{'aNum': #, 'c1Content': c1Content, 'c2Content': c2Content,
 *            'c3Content': c3Content, 'c4Content': c4Content, 'c5Content': c5Content}, {...so on...}]
 */ 
function getActivityWithChoices(req, res) {
    var query = "";
    var count = 0;
    for(var propt in req.query) {
        query += "SELECT A.aNum AS aNum, C1.rcContent AS c1Content, C2.rcContent AS c2Content, ";
        query += "C3.rcContent AS c3Content, C4.rcContent AS c4Content, C5.rcContent AS c5Content";
        query += "\nFROM Activities A, Response_Choices C1, Response_Choices C2, Response_Choices C3, Response_Choices C4, Response_Choices C5";
        query += "\nWHERE A.aNum=" + req.query[propt] + " AND A.choice1=C1.rcNum AND A.choice2=C2.rcNum AND A.choice3=C3.rcNum AND A.choice4=C4.rcNum AND A.choice5=C5.rcNum";
        
        if(count != Object.keys(req.query).length - 1) 
            query += "\nUNION\n";

        count++;
    }

    db.all(query, function(err, rows) {
        if(err)
            console.log(err);
        res.send(JSON.stringify(rows));

    });
    /*SELECT A.aNum, C1.rcNum AS c1, C1.rcContent AS c1Content, C2.rcNum AS c2, C2.rcContent AS c2Content, C3.rcNum AS c3, C3.rcContent AS c3Content, C4.rcNum AS c4, C4.rcContent AS c4Content, C5.rcNum AS c5, C5.rcContent AS c5Content
FROM Activities A, Response_Choices C1, Response_Choices C2, Response_Choices C3, Response_Choices C4, Response_Choices C5
WHERE A.aNum=3 AND A.choice1=C1.rcNum AND A.choice2=C2.rcNum AND A.choice3=C3.rcNum AND A.choice4=C4.rcNum AND A.choice5=C5.rcNum*/
}

/**
 *  Add an evaluator to the Evaluators table. 
 *  >>Input: req.query['name']: name, req.query['email'] = email, req.query['type'] = professional type
    >>Output: error if evaluator is already in db (defined by uniqueness on email), nothing otherwise
 */
function addEvaluator(req, res) {
    //var name = req.query['name'];
    var email = req.query['email'];
    //var type = req.query['type'];

    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(email) VALUES(?)");
        var run = stmt.run(email, function callback(err) {
            // error if email is repeated
            if(err)    // needs more clear error specification
                /*console.log("Error: Evaluator " + name + " is already in the database. This error can be ignored.")*/;  
        });
    });

    db.all("SELECT evid FROM Evaluators WHERE email=?", email, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
}

/*function addEvaluator(req, res) {
    var name = req.query['name'];
    var email = req.query['email'];
    var type = req.query['type'];

    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(name, email, type) VALUES(?, ?, ?)");
        var run = stmt.run(name, email, type, function callback(err) {
            // error if email is repeated
            if(err)    // needs more clear error specification
                console.log("Error: Evaluator " + name + " is already in the database. This error can be ignored.");  
        });
    });

    db.all("SELECT evid, name, type FROM Evaluators WHERE email=?", email, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
} */


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

function getActivities(req, res) {
    db.all("SELECT aNum, aContent FROM Activities", function(err, rows) {
        res.send(rows);
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


/** For testing purposes only. To be deleted in the future */
function addEvaluatorNoReq(json) {
    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(name, email, type) VALUES(?, ?, ?)");
        var run = stmt.run(json['name'], json['email'], json['type'], function callback(err) {
            // error if email is repeated
            if(err)    // needs more clear error specification
                res.send("Error: Evaluator %s is already in the database.", name);  
        });
    });
}

module.exports.addEpaWithQuestions = addEpaWithQuestions;
module.exports.getDB = getDB;
module.exports.initdb = initdb;
module.exports.addQuestionToEPA = addQuestionToEPA;
module.exports.addStudent = addStudent;
module.exports.addEvaluator = addEvaluator;
module.exports.logAssessment = logAssessment;
module.exports.logResponse = logResponse;
module.exports.getActivities = getActivities;
module.exports.checkEmail = checkEmail;
module.exports.getActivityWithChoices = getActivityWithChoices;
module.exports.viewEPAs = viewEPAs;
/** To be deleted in the future */
module.exports.addEvaluatorNoReq = addEvaluatorNoReq;