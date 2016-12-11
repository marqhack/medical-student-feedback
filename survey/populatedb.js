/**
 * Module to build the database with its EPAs and activities
 * @author Martin Porras
 *
 */

var db = require('./dbhandler');

/** EPAs */

db.initdb();
var epa = [];

// activity indeces: 1, 2, 3
epajson1 = {'epaNum': 1, 'activity': 'Gather a history and perform a physical examination',   
			// choice indeces: 1, 2, 3, 4, 5
			'q1': {q: 'History-taking', 1: 'Can be present, but not trusted to obtain most information', 
				   2: 'Can perform with direct (pro-active) supervision', 3: 'Can perform history with only indirect (reactive) supervision', 
				   4: 'Trusted to independently obtain complete and accurate history , Can perform with only distant oversight',
				   5: 'Expert. Trusted to supervise more junior learners'}, 
			// choice indeces: 6, 2, 7, 8, 5
			'q2': {q: 'Physical exam', 1: 'Can be present, but not trusted to perform most of exam', 2: 'Can perform with direct (pro-active) supervision',
			       3: 'Can perform exam with only indirect (reactive) supervision', 4: 'Trusted to independently complete appropriate exam, Can perform with only distant oversight',
			       5: 'Expert. Trusted to supervise more junior learners'}, 
			// choice indeces: 9, 10, 11, 12, 13
			'q3': {q: 'Verbal communication with patients', 1: 'Capable of shadowing, contributing, but not trusted alone with patient', 2: 'Requires direct (pro- active) supervision', 
			       3: 'Can lead patient conversation with only indirect (reactive) supervision', 4: 'Trusted to independently lead patient conversations, Requires only distant supervision',
			       5: 'Expert communicator. Capable of supervising junior learners'}};
//activity index: 4
epajson2 = {'epaNum': 2, 'activity': 'Prioritize a differential diagnosis following a clinical encounter', 
			// choice indeces: 14, 2, 15, 16, 17
			'q1': {q: 'Differential Diagnosis', 1: 'Difficulty generating differential even with supervision', 2: 'Can perform with direct (pro-active) supervision', 
				   3: 'Requires only indirect (reactive) supervision to develop a differential', 4: 'Trusted to independently generate thorough differential, Requires only distant oversight', 
				   5: 'Expert. Can supervise more junior learners in generating differential'}}; 
// activity indeces: 5, 6 
epajson3 = {'epaNum': 3, 'activity': 'Recommend and interpret common diagnostic and screening tests', 
			// choice indeces: 18, 10, 19, 20, 21
			'q1': {q: 'Testing', 1: 'Cannot interpret or suggest tests despite guidance', 2: 'Requires direct (pro- active) supervision', 3: 'Requires only indirect (reactive) supervision', 
				   4: 'Trusted to independently interpret tests, requires only distant oversight', 5: 'Expert. Can supervise junior learners'} , 
		    // choice indeces: 22, 10, 19, 23, 21
		    'q2': {q: 'Management plan', 1: 'Difficulty generating management plan even with supervision', 2: 'Requires direct (pro- active) supervision', 3: 'Requires only indirect (reactive) supervision', 
				   4: 'Trusted to independently develop complete plan, requires only distant oversight', 5: 'Expert. Can supervise junior learners'}};
// activity indeces 6,7,8
epajson4 = {'epaNum': 4, 'activity': 'Enter and discuss orders and prescriptions', 
			// choice indeces: 22, 10, 19, 23, 21
			'q1': {q: 'Management plan', 1: 'Difficulty generating management plan even with supervision', 2: 'Requires direct (pro- active) supervision', 3: 'Requires only indirect (reactive) supervision', 
				   4: 'Trusted to independently develop complete plan, requires only distant oversight', 5: 'Expert. Can supervise junior learners'}, 
		    // choice indeces: 24, 25, 26, 27, 28
		    'q2': {q: 'Writing orders', 1: 'Capable of being present, but not trusted to write order', 2: 'Requires direct (pro- active) supervision to enter order', 3: 'Can enter orders with only indirect (reactive) supervision',
		           4: 'Trusted to enter orders independently, Requires only distant supervision', 5: 'Expert. Capable of supervising junior learners'},
		    // choice indeces: 29, 30, 31, 32, 28
		    'q3': {q: 'Writing prescriptions', 1: 'Cannot complete prescription despite guidance', 2: 'Requires direct (pro- active) supervision to answer write prescription', 3: 'Can write common prescriptions with only indirect (reactive) supervision', 
		           4: 'Would be trusted to write common prescriptions independently and require only distant supervision', 5: 'Expert. Capable of supervising junior learners'}}; 

epajson5 = {'epaNum': 5, 'activity': 'Document a clinical encounter in the patient record', 
			'q1': {q: 'Written Communication, including write-ups', 1: 'Can contribute, but not able to write complete note', 2: 'Requires direct (pro- active) supervision to achieve complete notes', 3: 'Can write thorough notes with only indirect (reactive) supervision',
			       4: 'Trusted to independently write complete and thorough notes; requires only distant supervision', 5: 'Expert. Capable of supervising junior learners'}}; //9
epajson6 = {'epaNum': 6, 'activity': 'Provide an oral presentation of a clinical encounter', 
			'q1': {q: 'Oral patient presentations, including consults', 1: 'Difficulty presenting patient information even with supervision', 2: 'Requires direct (pro- active) supervision', 3: 'Requires only indirect (reactive) supervision', 
			       4: 'Trusted to independently present complete patient information, Requires only distant supervision', 5: 'Expert communicator. Capable of supervising junior learners'}}; //10
epajson7 = {'epaNum': 7, 'activity': 'Review of literature', 
			'q1': {q: 'Review of literature', 1: 'Cannot obtain answers to clinical questions despite guidance', 2: 'Requires direct (pro- active) supervision to answer clinical questions', 3: 'Can identify and answer important clinical questions with only indirect (reactive) supervision', 
			       4: 'Trusted to identify and answer clinical questions independently, Requires only distant supervision', 5: 'Expert. Capable of supervising junior learners'}}; //11
epajson8 = {'epaNum': 8, 'activity': 'Give or receive a patient handover to transition care responsibility', 
			'q1': {q: 'Patient handover', 1: 'Difficulty completing patient handover even with supervision', 2: 'Can perform handover with direct (pro-active) supervision', 3: 'Requires only indirect (reactive) supervision', 4: 'Trusted to independently handover a patient; requires only distant oversight',
			       5: 'Expert. Capable of supervising junior learners.'}}; //12
epajson11 = {'epaNum': 11, 'activity': 'Obtain informed consent for tests and/or procedures', 
			'q1': {q: 'Informed consent', 1: 'Can be present, but not trusted to obtain consent', 2: 'Requires direct (pro- active) supervision to obtain informed consent', 3: 'Can obtain consent with only indirect (reactive) supervision', 4: 'Trusted to independently obtain consent; requires only distant supervision',
			       5: 'Expert. Capable of supervising junior learners'}}; //13
epajson14 = {'epaNum': 14, 'activity': 'Develop management plan and behavior change goals together with patients for common chronic conditions', 
			'q1': {q: 'Verbal communication with patients', 1: 'Capable of shadowing, contributing, but not trusted alone with patient', 2: 'Requires direct (pro- active) supervision', 
			       3: 'Can lead patient conversation with only indirect (reactive) supervision', 4: 'Trusted to independently lead patient conversations, Requires only distant supervision',
			       5: 'Expert communicator. Capable of supervising junior learners'}}; //3
epajson15 = {'epaNum': 15, 'activity': 'Demonstrate approach to prevention care at the individual and population level', 
			'q1': {q: 'Management plan', 1: 'Difficulty generating management plan even with supervision', 2: 'Requires direct (pro- active) supervision', 3: 'Requires only indirect (reactive) supervision', 
				   4: 'Trusted to independently develop complete plan, requires only distant oversight', 5: 'Expert. Can supervise junior learners'}}; //6

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