/**
 * Controller for database operations in the web app. 
 * @author Martin Porras
 */
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose(); 
var path = require('path');
var dbPath = path.resolve(__dirname, 'medFeedback.db')
var db = new sqlite3.Database(dbPath);
var request = require('request');


/**
 * Intialize the database, creating the tables if they do not already exist. Also populates the database with the patient survey questions.
 */
function initdb() {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS Students(pid INTEGER PRIMARY KEY, firstName STRING NOT NULL, lastName STRING NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Evaluators(evid INTEGER PRIMARY KEY AUTOINCREMENT, firstName STRING, lastName STRING, email STRING NOT NULL, type STRING, UNIQUE(email))");
        db.run("CREATE TABLE IF NOT EXISTS EPAs(epaNum INTEGER PRIMARY KEY, activity STRING NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Activities(aNum INTEGER PRIMARY KEY AUTOINCREMENT, aContent STRING NOT NULL, choice1 INTEGER, choice2 INTEGER, choice3 INTEGER, choice4 INTEGER, \
                choice5 INTEGER, FOREIGN KEY(choice1, choice2, choice3, choice4, choice5) REFERENCES Response_Choices, UNIQUE(aContent))");
        db.run("CREATE TABLE IF NOT EXISTS Survey(epaNum INTEGER, aNum INTEGER, FOREIGN KEY(epaNum) REFERENCES EPAs, FOREIGN KEY(aNum) REFERENCES Activities, \
                PRIMARY KEY(epaNum, aNum))");
        db.run("CREATE TABLE IF NOT EXISTS Response_Choices(rcNum INTEGER PRIMARY KEY AUTOINCREMENT, rcContent STRING NOT NULL, UNIQUE(rcContent))");
        db.run("CREATE TABLE IF NOT EXISTS Patient_Questions(pqNum INTEGER PRIMARY KEY AUTOINCREMENT, pqContent STRING NOT NULL, choice1 STRING, choice2 STRING, choice3 STRING, \
                choice4 STRING, choice5 STRING, UNIQUE(pqContent))");
        db.run("CREATE TABLE IF NOT EXISTS Assessments(aid INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER NOT NULL, evid INTEGER NOT NULL, aNum INTEGER NOT NULL, score INTEGER NOT NULL, completed DATETIME NOT NULL, comment STRING DEFAULT NULL, FOREIGN KEY(pid) REFERENCES Students, \
                FOREIGN KEY(evid) REFERENCES Evaluators, FOREIGN KEY(aNum) References Activities)");
    });
    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(evid, firstName, lastName, email, type) VALUES(?,?,?,?,?)");
        var run = stmt.run(0, "patient", "feedback", "ptntfdbck", "na", function callback(err) {
            if(err && err['errno'] != 19)    
                console.log("Error initializing database: " + err);
        });
        stmt.finalize();
    });
    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(evid, firstName, lastName, email, type) VALUES(?,?,?,?,?)");
        var run = stmt.run(1, "student", "feedback", "stdntfdback", "na", function callback(err) {
            if(err && err['errno'] != 19)    
                console.log("Error initializing database: " + err);
        });
        stmt.finalize();
    });
    initPatientQuestTable();

    function initPatientQuestTable() {
        db.serialize(function() { 
            var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent, choice1, choice2, choice3) VALUES(?,?,?,?)");
            var run = stmt.run("Student cleaned hands with either soap or hand sanitizer before performing a physical exam?", "yes", "no", "uncertain", function callback(err) {
                if(err && err['errno'] != 19)    
                    console.log("Error initializing database: " + err);
            });
            stmt.finalize();

            var quest = [];
            quest.push({q: "How well did this student do at being friendly, kind or compassionate?", choice1: "poorly/incompletely", choice2: "", choice3: "average", choice4: "", choice5: "excellently/completely"});
            quest.push({q: "How well was this student able to obtain the full story of your current illness/visit?", choice1: "poorly/incompletely", choice2: "", choice3: "average", choice4: "", choice5: "excellently/completely"});
            quest.push({q: "How well did this student consider or address barriers you might have to medical care? This may include financial, time, transportation, other daily struggles that limit your health.", choice1: "poorly/incompletely", choice2: "", choice3: "average", choice4: "", choice5: "excellently/completely"});
            quest.push({q: "How well did this student seem to perform the physical exam?", choice1: "poorly/incompletely", choice2: "", choice3: "average", choice4: "", choice5: "excellently/completely"});
            quest.push({q: "How well was the student able to discuss the plan for your medical care?", choice1: "poorly/incompletely", choice2: "", choice3: "average", choice4: "", choice5: "excellently/completely"});
            quest.push({q: "How well did this student listen to your concerns and/or allow you to ask all your questions?", choice1: "poorly/incompletely", choice2: "", choice3: "average", choice4: "", choice5: "excellently/completely"});
            quest.forEach(function(question) {
                insertQW5Choices(question);
            });

            var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent) VALUES(?)");
            var run = stmt.run("What did this student do well?", function callback(err) {
                if(err && err['errno'] != 19)    
                    console.log("Error initializing database: " + err);
            });
            stmt.finalize();

            var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent) VALUES(?)");
            var run = stmt.run("What suggestions/advice can you share to help this student improve performance?", function callback(err) {
                if(err && err['errno'] != 19)    
                    console.log("Error initializing database: " + err);
            });
            stmt.finalize();

            var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent, choice1, choice2) VALUES(?,?,?)");
            var run = stmt.run("If Spanish, did this patient use an interpreter?", "yes", "no", function callback(err) {
                if(err && err['errno'] != 19)    
                    console.log("Error initializing database: " + err);
            });
            stmt.finalize();

            var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent, choice1, choice2, choice3) VALUES(?,?,?, ?)");
            var run = stmt.run("If used an interpreter, did student direct more attention to the patient or interpreter?", "patient", "interpreter", "N/A", function callback(err) {
                if(err && err['errno'] != 19)    
                    console.log("Error initializing database: " + err);
            });
            stmt.finalize();

            var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent, choice1, choice2, choice3, choice4, choice5) VALUES(?,?,?,?,?,?)");
            var run = stmt.run("If student spoke Spanish, how would you rate the student's Spanish skills?", "Minimal - few words", "Basic - basic phrases, some medical terms, clearly still learning", 
                               "Advanced - complex sentences, terms, concepts, can function without interpreter, though can tell non-native speaker", "Fluent - no difference from native speaker and trusted to provide care in Spanish",
                               "N/A", function callback(err) {
                if(err && err['errno'] != 19)    
                    console.log("Error initializing database: " + err);
            });
            stmt.finalize();        

        });

        function insertQW5Choices(json) {
            db.serialize(function() { 
                var stmt = db.prepare("INSERT INTO Patient_Questions(pqContent, choice1, choice2, choice3, choice4, choice5) VALUES(?,?,?,?,?,?)");
                var run = stmt.run(json['q'], json['choice1'], json['choice2'], json['choice3'], json['choice4'], json['choice5'], function callback(err) {
                if(err && err['errno'] != 19)
                    console.log("Error initializing database: " + err);
                });
                stmt.finalize();
            });
        }
    }
}

/**
 * Function that adds a new EPA along with its set of activities to the database. Response choices for each
 * activity are likewise bound to each activity. If an admin interface is developed in the future, then this
 * function can be easily extended to support the request/response format of the API calls used in the application.
 *
 * INPUT>>A json object with the following format: json['epaNum'] = epa#, json['activity'] = epaDescription,
 *        json['q1'] = {q: 'activity question', 1: 'choice1', 2: 'choice1', 3: 'choice1', 4: 'choice1', 5: 'choice1'}, 
 *        json['q2'] = {q: 'activity question', 1: 'choice1', 2: 'choice1', 3: 'choice1', 4: 'choice1', 5: 'choice1'},...,
 *        json['qn'] = {q: 'activity question', 1: 'choice1', 2: 'choice1', 3: 'choice1', 4: 'choice1', 5: 'choice1'}
 */
function addEpaWithQuestions(json) {
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO EPAs VALUES (?, ?)");
        var run = stmt.run(json['epaNum'], json['activity'], function callback(err) {
            if(err != undefined && err['errno'] == 19)
                console.log("Error: There is already an EPA numbered %d.", json['epaNum']);
            else if(err != undefined && err['errno']!= 19) 
                console.log("An unknown (for now) error has occured when trying to add an EPA" + err);
            else {
                stmt.finalize();
                addQuestions(json);
            }
        });

        var qArray = [];
        function addQuestions(json) {    
            var counter = 0;
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
                            if(err != undefined && err['errno'] != 19) {
                                console.log("Unknown error occurred when adding EPA: " + err);            
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
                        if(err != undefined && err['errno'] != 19) {
                            console.log("Unknown error occurred when adding EPA: " + err);            
                        }             
                    }); 
                }); 
            });
        }
    });   
}

/**
 * Add an activity to an existing EPA. This function is not actually impletmented in our application, but is left to show how adding an activity
 * to an EPA could be done (although the function is incomplete). This function can also be extended to support request/response calls. 
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
 * Function to bind the response choices for each new activity added in addEPAWithQuestions function. This func-
 * tion is not visible to external code. 
 * INPUT>> An array having the activity name and its response choices, in the following format: 
 *         [q: 'activity question', 1: 'choice1', 2: 'choice1', 3: 'choice1', 4: 'choice1', 5: 'choice1']
 */
function bindResponseChoicesToActivity(choices) {
    db.serialize(function() {
        db.all("SELECT aNum FROM Activities WHERE aContent=?", choices.q, function(err, rows) {
            for(var propt in choices)
                if(propt != "q")
                    addToDb(rows[0].aNum, choices[propt], propt);           
        });
    });

    function addToDb(aNum, choice, choiceNum) {
        db.serialize(function() { 
            var stmt = db.prepare("INSERT INTO Response_Choices(rcContent) VALUES(?)");
            var run = stmt.run(choice, function callback(err) {
            });
            stmt.finalize();
        });

        db.serialize(function() {
            db.all("SELECT rcNum FROM Response_Choices WHERE rcContent=?", choice, function(err, rows) {
                var rcNum = rows[0].rcNum;
                var query = "UPDATE Activities SET choice" + choiceNum + "=? WHERE aNum=" + aNum;
                var stmt = db.prepare(query);
                var run = stmt.run(rcNum, function callback(err) {                  
                });  
                stmt.finalize();
            });
         });
    }
}

/**
 * API call to return all EPAs from the EPAs table.
 * INPUT>> None. 
 * OUTPUT>> Array of JSON object containg each EPA in the EPAs table. 
 */
function viewEPAs(req, res) {
    db.serialize(function() { 
        db.all("SELECT * FROM EPAs", function(err, rows) {
            res.send(rows);
        });
    });
}

/**
 *  API call to check if a given email matches that of an evaluator in the database. 
 *  >>INPUT: req.query['email']: the requested email adress
 *  >>OUTPUT: evid, name, and type of the evaluator. null if an evaluator is not found
 */
function checkEmail(req, res) {
    var email = req.query['email'];

    if(email == null)
        res.send(null);

    db.all("SELECT evid, firstName, lastName, type FROM Evaluators WHERE email=?", email, function(err, rows) {
        if(rows != null && rows.length != 0)
            res.send(JSON.stringify(rows[0]))
        else
            res.send(null);
    });
}

/**
 *  Returns the response choices associated with each activity number listed in the parameter. The name of the
 *  parameters does not matter, but each must have a numeric value indicating an activity number. 
 *  >>INPUT: activity numbers through the req object (parameters can be named anything)
 *  >>OUTPUT: array containg activity numbers with their choices, in ascending numerical number of activities,
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
}

/**
 *  API call to add an evaluator to the Evaluators table. 
 *  >>INPUT: req.query['name']: name, req.query['email'] = email, req.query['type'] = professional type
    >>OUTPUT: the evid of the new evaluator
 */
function addEvaluator(req, res) {
    var email = req.body['email'];
    
    // prevent application from crashing
    if(email == null)
        return;

    db.serialize(function() { 
        var stmt = db.prepare("INSERT INTO Evaluators(email) VALUES(?)");
        var run = stmt.run(email, function callback(err) {
            if(err != undefined && err['errno'] != 19) {   
                console.log("Unknown error adding new evaluator with email" + email + ":" + err); 
            } else {
                console.log("Evaluator with email " + email + " was added correctly");
            }
        });
        stmt.finalize();
    });

    db.all("SELECT evid FROM Evaluators WHERE email=?", email, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
}

/**
 *  API call to log an assessment to the Assessments table, and also send it to the epa-tracker team. 
 *  INPUT>> JSON object in the form {'pid': 720529523, 'evaluator_id': 1, 'evaluator_fname': 'x', 'evaluator_lname': x, 'evaluator_type': x,
 *  'responses': [{'activity_id': x, 'choice': x, 'comment': x}, {'activity_id': x, 'choice': x, 'comment': x/null}]}. An evid of 0 indicates that
 *  this is a patient survey, which is also recorded in the Assessments table. The content from the matching Patient_Questions table id will be sent instead 
 *  of the activity content from the Activities table (no patient feedback is sent to the other team yet)
 *  
 */
function logAssessment(req, res) {
    var currentdate = new Date();
    var month = (currentdate.getMonth() + 1) < 10 ? "0" + (currentdate.getMonth() + 1) : currentdate.getMonth() + 1;
    var day = currentdate.getDate() < 10 ? "0" + currentdate.getDate() : currentdate.getDate();
    var hour = currentdate.getHours() < 10 ? "0" + currentdate.getHours() : currentdate.getHours();
    var mins = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
    var secs = currentdate.getSeconds() < 10 ? "0" + currentdate.getSeconds() : currentdate.getSeconds();

    currentdate = currentdate.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + mins + ":" + secs;
    req.body['responses'].forEach(function(activity) {     
        enterToDB(req.body['pid'], req.body['evaluator_id'], activity['activity_id'], activity['choice'], currentdate, activity['comment']);
    });   


    function enterToDB(pid, evid, aNum, choiceNum, date, comment) {
        db.serialize(function() { 
            var stmt = db.prepare("INSERT INTO Assessments(pid, evid, aNum, score, completed, comment) VALUES(?,?,?,?,?,?)");
            var run = stmt.run(pid, evid, aNum, choiceNum, date, comment, function callback(err) {
                if(err) 
                    console.log("Unexpected error in inserting a new Assessment."); 
            });
            stmt.finalize();
        });

        if(evid != 0 && evid != 1) {
            db.all("SELECT * FROM Evaluators where evid=?", req.body['evaluator_id'], function(err, rows) {
                if(rows[0].firstName == null && rows[0].lastName == null && rows[0].type == null) {
                    var stmt = db.prepare("UPDATE Evaluators SET firstName=?, lastName=?, type=? WHERE evid=" + req.body['evaluator_id']);
                    var run = stmt.run(req.body['evaluator_fname'], req.body['evaluator_lname'], req.body['evaluator_type'], function callback(err) {
                    if(err) 
                        console.log("Unexpected error in inserting an evaluator."); 
                    });
                    stmt.finalize();
                }
                else if(rows[0].type != req.body['evaluator_type']) {
                    var stmt = db.prepare("UPDATE Evaluators SET type=? WHERE evid=" + req.body['evaluator_id']);
                    var run = stmt.run(req.body['evaluator_type'], function callback(err) {
                    if(err) 
                        console.log("Unexpected error in updating an evaluator's type."); 
                    });
                    stmt.finalize();
                }
            });

            sendAssessment(pid, evid, aNum, choiceNum, date, comment);
        }
        // patient, student feedback
        else 
            sendAssessment(pid, evid, aNum, choiceNum, date, comment);
    }

    /** Send evaluation over to other team */
    function sendAssessment(pid, evid, aNum, choiceNum, date, comment) {
        // if assessment is N/A, don't send it
        if(choiceNum == 0 && evid != 0)
            return;

        if(evid != 0 && evid != 1) {
            db.all("SELECT S.epaNum, A.aContent FROM Survey S, Activities A WHERE S.aNum=? AND S.aNum=A.aNum", aNum, function(err, rows) {
                rows.forEach(function(epa) {
                    console.log("Sending assessment to the epa tracker");
                    var post_obj = {student: pid, epaid: epa.epaNum, title: epa.aContent, examdate: date, newval: choiceNum == 5 ? 4: choiceNum, comments: comment};
                    console.log(post_obj);
                    request.post({ url: 'http://localhost:8080/new/exam', json: post_obj },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                            } else {
                                console.log(error);
                            }
                        }
                    );
                });
            });
        }
        else {
            db.all("SELECT pqContent FROM Patient_Questions WHERE pqNum=?", aNum, function(err, rows) {
                // this is where the code will go to send patient feedback to the other team
            });
        }
    }
}

/**
 * API call to return all activities from the Activities table by their ascending numerical order. Takes
 * no input and has no output.
 */
function getActivities(req, res) {
    db.all("SELECT aNum, aContent FROM Activities ORDER BY aNum", function(err, rows) {
        res.send(rows);
    });
}

/**
 * API call to return all activities from the Patient_Questions table. Takes no input and has
 * no output.
 */
function getPatientQuestions(req, res) {
    db.all("SELECT * FROM Patient_Questions", function(err, rows) {
        res.send(rows);
    });
}

/**
 * API call that collects information on the student and evaluator and returns the respective survey based
 * on the activities being tested.
 */
function getSurvey(req, res) {
    response = {};
    var pid = req.query['pid'];
    var evaluator_id = req.query['evid'];
    var evaluator_name;
    var evaluator_email;
    var evaluator_type;
    var activities = req.query['activities'].split('-');

    var eval_query = "SELECT evid, email, firstName, lastName, type FROM Evaluators WHERE evid=" + evaluator_id;

    db.all(eval_query, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            response.pid = pid;
            response.evid = rows[0].evid;
            response.email = rows[0].email;
            response.first_name = rows[0].firstName;
            response.last_name = rows[0].lastName;
            response.type = rows[0].type;
        }
    });

    var query = "";
    activities.forEach(function(activityID, index) {

        query += "SELECT A.aNum AS aNum, A.aContent AS aContent, C1.rcContent AS c1Content, C2.rcContent AS c2Content, ";
        query += "C3.rcContent AS c3Content, C4.rcContent AS c4Content, C5.rcContent AS c5Content";
        query += "\nFROM Activities A, Response_Choices C1, Response_Choices C2, Response_Choices C3, Response_Choices C4, Response_Choices C5";
        query += "\nWHERE A.aNum=" + activityID + " AND A.choice1=C1.rcNum AND A.choice2=C2.rcNum AND A.choice3=C3.rcNum AND A.choice4=C4.rcNum AND A.choice5=C5.rcNum";
        
        if(index != activities.length - 1) 
            query += "\nUNION\n";

    });

    db.all(query, function(err, rows) {
        if(err) {
            console.log(err);
        } else {
            response.activities = rows;
            res.send(JSON.stringify(response));
        }
    });
}

module.exports.addEpaWithQuestions = addEpaWithQuestions;
module.exports.initdb = initdb;
module.exports.addQuestionToEPA = addQuestionToEPA;
module.exports.addEvaluator = addEvaluator;
module.exports.logAssessment = logAssessment;
module.exports.getActivities = getActivities;
module.exports.checkEmail = checkEmail;
module.exports.getActivityWithChoices = getActivityWithChoices;
module.exports.viewEPAs = viewEPAs;
module.exports.getSurvey = getSurvey;
module.exports.getPatientQuestions = getPatientQuestions;