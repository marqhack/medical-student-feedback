var db = require('./dbhandler');

/** EPAs */

db.initdb();
var epa = [];

epajson1 = {'epaNum': 1, 'activity': 'Gather a history and perform a physical examination', 
			'q1': 'History-taking', 'q2': 'Physical exam', 'q3': 'Verbal communication with patients'};
epajson2 = {'epaNum': 2, 'activity': 'Prioritize a differential diagnosis following a clinical encounter', 
			'q1': 'Differential Diagnosis'};
epajson3 = {'epaNum': 3, 'activity': 'Recommend and interpret common diagnostic and screening tests', 
			'q1': 'Testing', 'q2': 'Management plan'};
epajson4 = {'epaNum': 4, 'activity': 'Enter and discuss orders and prescriptions', 
			'q1': 'Management plan', 'q2': 'Writing orders', 'q3': 'Writing prescriptions'};
epajson5 = {'epaNum': 5, 'activity': 'Document a clinical encounter in the patient record', 
			'q1': 'Written Communication, including write-ups'};
epajson6 = {'epaNum': 6, 'activity': 'Provide an oral presentation of a clinical encounter', 
			'q1': 'Oral patient presentations, including consults'};
epajson7 = {'epaNum': 7, 'activity': 'Review of literature', 
			'q1': 'Review of literature'};
epajson8 = {'epaNum': 8, 'activity': 'Give or receive a patient handover to transition care responsibility', 
			'q1': 'Patient handover'};
epajson11 = {'epaNum': 11, 'activity': 'Obtain informed consent for tests and/or procedures', 
			'q1': 'Informed consent'};
epajson14 = {'epaNum': 14, 'activity': 'Develop management plan and behavior change goals together with patients for common chronic conditions', 
			'q1': 'Verbal communication with patients'};
epajson15 = {'epaNum': 15, 'activity': 'Demonstrate approach to prevention care at the individual and population level', 
			'q1': 'Management plan'};

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

// new question
/*epawquest = {'epaNum': 1, 'question':'4This is the first question--New!'}; // 11 --  
epawquest2 = {'epaNum': 1, 'question':'3rd q for epa3'};  // 8 --
db.addQuestionToEPA(epawquest);
db.addQuestionToEPA(epawquest2);
// EPA isn't in db yet
epawquest2 = {'epaNum': 30, 'question':'3rd q for epa3'}; // correctly threw error! --
db.addQuestionToEPA(epawquest2);*/