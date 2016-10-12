var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('medFeedback.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS Students(pid INTEGER PRIMARY KEY AUTOINCREMENT, name STRING NOT NULL, rotation STRING)");
    db.run("CREATE TABLE IF NOT EXISTS Evaluators(evid INTEGER PRIMARY KEY AUTOINCREMENT, email STRING, UNIQUE(email))");
    db.run("CREATE TABLE IF NOT EXISTS EPAs(epaNum INTEGER, name STRING NOT NULL, description STRING NOT NULL, UNIQUE(epaNum))");
    db.run("CREATE TABLE IF NOT EXISTS Questions(qid INTEGER PRIMARY KEY AUTOINCREMENT, epaNum INTEGER, qNum INTEGER, content STRING, FOREIGN KEY(epaNum) REFERENCES EPAs, UNIQUE(epaNum, qNum))");
    db.run("CREATE TABLE IF NOT EXISTS Assessments(aid INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, evid INTEGER, epaNum INTEGER, surveyID INTEGER, date DATE NOT NULL, FOREIGN KEY(pid) REFERENCES Students, FOREIGN KEY(evid) REFERENCES Evaluators, FOREIGN KEY(epaNum) References EPAs, UNIQUE(pid, evid, epaNum, surveyID))");
    db.run("CREATE TABLE IF NOT EXISTS Responses(rid INTEGER PRIMARY KEY AUTOINCREMENT, aid INTEGER, qid INTEGER, score INTEGER, FOREIGN KEY(aid) REFERENCES Assessments, FOREIGN KEY(qid) REFERENCES Questions, UNIQUE(aid, qid))");
    db.run("CREATE TABLE IF NOT EXISTS Comments(rid INTEGER PRIMARY KEY, comment STRING NOT NULL, FOREIGN KEY(rid) REFERENCES Responses)");
});

/**
 * Would probably need some kind of error checking for duplicate EPAs--suggesting
 * replacement or creation of a new EPA is a good choice. 
 */
function addEPA(json) {
	var stmt = db.prepare("INSERT INTO EPAs VALUES (?, ?, ?)");
    var run = stmt.run(json['epaNum'], json['name'], json['description'], function callback(err) {
		console.log(err.message);
	});
    stmt.finalize(); 
}

function getDB() {
	return db;
}

/**
 *
 *
 */
module.exports.addEPA = addEPA;
module.exports.getDB = getDB;