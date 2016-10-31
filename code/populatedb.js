/**
 * Module to populate and test the database functions in dbhandler.js. Only the EPAs section below
 * will be kept for building the database with EPAs and their questions for the final production.
 *
 */

var db = require('./dbhandler');

/** EPAs */

db.initdb();
var epa = [];

epajson1 = {'epaNum': 1, 'activity': 'Gather a history and perform a physical examination', 
			'q1': 'History-taking', 'q2': 'Physical exam', 'q3': 'Verbal communication with patients'}; //1,2,3
epajson2 = {'epaNum': 2, 'activity': 'Prioritize a differential diagnosis following a clinical encounter', 
			'q1': 'Differential Diagnosis'}; //4
epajson3 = {'epaNum': 3, 'activity': 'Recommend and interpret common diagnostic and screening tests', 
			'q1': 'Testing', 'q2': 'Management plan'}; //5,6
epajson4 = {'epaNum': 4, 'activity': 'Enter and discuss orders and prescriptions', 
			'q1': 'Management plan', 'q2': 'Writing orders', 'q3': 'Writing prescriptions'}; //6,7,8
epajson5 = {'epaNum': 5, 'activity': 'Document a clinical encounter in the patient record', 
			'q1': 'Written Communication, including write-ups'}; //9
epajson6 = {'epaNum': 6, 'activity': 'Provide an oral presentation of a clinical encounter', 
			'q1': 'Oral patient presentations, including consults'}; //10
epajson7 = {'epaNum': 7, 'activity': 'Review of literature', 
			'q1': 'Review of literature'}; //11
epajson8 = {'epaNum': 8, 'activity': 'Give or receive a patient handover to transition care responsibility', 
			'q1': 'Patient handover'}; //12
epajson11 = {'epaNum': 11, 'activity': 'Obtain informed consent for tests and/or procedures', 
			'q1': 'Informed consent'}; //13
epajson14 = {'epaNum': 14, 'activity': 'Develop management plan and behavior change goals together with patients for common chronic conditions', 
			'q1': 'Verbal communication with patients'}; //3
epajson15 = {'epaNum': 15, 'activity': 'Demonstrate approach to prevention care at the individual and population level', 
			'q1': 'Management plan'}; //6

epa.push(epajson1);
epa.push(epajson2);
epa.push(epajson3);
epa.push(epajson4);
epa.push(epajson5);
epa.push(epajson6);
epa.push(epajson7);
epa.push(epajson8);
epa.push(epajson11);
epa.push(epajson14);
epa.push(epajson15);

for(i = 0; i < epa.length; i++) {
	db.addEpaWithQuestions(epa[i]);
}



/** Testing of addQuestionEoEPA */
epawquest1 = {'epaNum': 1, 'question':'New q for EPA1'}; //14--
epawquest2 = {'epaNum': 11, 'question':'New q for EPA1'}; //14--  
epawquest3 = {'epaNum': 2, 'question':'Writing orders'}; //7--
epawquest4 = {'epaNum': 8, 'question':'Review of literature'}; //11-- 
db.addQuestionToEPA(epawquest1);
db.addQuestionToEPA(epawquest2);
db.addQuestionToEPA(epawquest3);
db.addQuestionToEPA(epawquest4);

// repeated questions
epawquest1 = {'epaNum': 4, 'question':'Writing orders'};  //error 
epawquest2 = {'epaNum': 8, 'question':'Review of literature'}; //error
epawquest3 = {'epaNum': 6, 'question':'Review of literature'}; //11--
epawquest4 = {'epaNum': 2, 'question':'Differential Diagnosis'}; //error
epawquest5 = {'epaNum': 1, 'question':'New q for EPA1'}; //error
epawquest6 = {'epaNum': 1, 'question':'Testing'}; //5--
epawquest7 = {'epaNum': 15, 'question':'Management plan'}; // error
db.addQuestionToEPA(epawquest1);
db.addQuestionToEPA(epawquest2);
db.addQuestionToEPA(epawquest3);
db.addQuestionToEPA(epawquest4);
db.addQuestionToEPA(epawquest5);
db.addQuestionToEPA(epawquest6);
db.addQuestionToEPA(epawquest7);
//EPA is not in db yet--error.
epawquest2 = {'epaNum': 30, 'question':'3rd q for epa3'}; // correctly threw error! --
db.addQuestionToEPA(epawquest2);


/** Students */
