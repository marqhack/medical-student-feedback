$(document).ready(function() {

	// render_observers_panel();
	$("#page-1").on('click', '.inactive' ,function() {
		//console.log("inactive clicked");
		$(this).attr({ 'class': 'active' });
	});

	$("#page-1").on('click', '.active' ,function() {
		console.log("active clicked");
		$(this).attr({ 'class': 'inactive' });
	});

	$("#add-observer").on('click', function() {
		add_observer_div();
	});

	$("#submit-observers").on('click', function() {
		get_observer_info();
		$("#page-1").hide();
		$("#page-2").show();
		render_survey();
	});

	$("#add-observer").click();
});

function render_activities_table(activities) {
	console.log(activities);
}

function add_observer_div() {
	var observer_info_container = $('<div class="observer-info">');
	var email = $('<div class="email">Email: <input type="email" placeholder="example@xyz.com"></div>');

	var activities_container = $('<div class="activities-container"></div>');
	$.get('api/test', function(activities_json) {
		activities_json.forEach(function(activity) {
			//console.log(activity);	
			activities_container.append($('<button id="' + activity.aNum + '"" class="inactive">' + activity.aContent + '</button>'));
		});
	});
	

	var checkbox = $('<div class="checkbox"><input type="checkbox">Taking survey on this device?</div>');

	$(observer_info_container).append(email);
	$(observer_info_container).append(activities_container);
	$(observer_info_container).append(checkbox);
	$("#observers-container").append(observer_info_container);
}

function get_observer_info() {
	var observer_info = [];
	$(".observer-info").each(function() {
		var info = {
			email: ($(this).find($("input[type=email]")).val()),
			on_device: ($(this).find($("input[type=checkbox]"))).prop('checked')
		}
		var selected_activities = [];
		($(this).find($(".active"))).each(function(index, activity) {
			console.log(activity);
			selected_activities.push($(activity).prop('id'));
		});
		info.activities = selected_activities;
		observer_info.push(info);
	});
	//console.log(observer_info);
}

function render_survey() {
	var fake_survey_response = [
    	{ "observerId": 1, "name":"Bob Doctor", "questions": ["History-Taking","Physical Exam","Writing Orders"]},
    	{ "observerId": 2, "name":"Tim Intern", "questions": ["Patient Handover","Physical Exam","Differential Diagnosis"]},
    	{ "observerId": 2, "name":"Peri Professional", "questions": ["Writing Prescriptions","Physical Exam","Management Exam"]}
	]

	fake_survey_response.forEach(function(survey) {
		individual_container = $('<div class="survey"></div>');
		text_field_name = $('<div class="observer-name">Name: <input type="text" value="' + survey.name + '"></input></div>');
		dropdown_position = $('<div class="observer-position">Position: <select id="position"><option>Resident</option><option>Faculty</option><option>Patient</option></select>')
		questions_container = $('<div class="questions"></div>');
		survey.questions.forEach(function(question) {
			question_and_responses = $('<div class="question-and-repsonses"></div>');
			question = $('<div class="question">' + question + '</div>');
			radio_set = $('<div class="radio-set"></div>');
			radio_text = ["0", "1", "2", "3", "4", "5"];
			radio_text.forEach(function(text, index){
				$(radio_set).append($('<input class="radio" type=radio name="' + survey.observerId + '-' + question + '" value="' + index + '">' + text + "</input>"));
			});
			text_response = $('<textarea class="comment" id="' + survey.observerId + '-' + question + '"></textarea>');
			$(question_and_responses).append($(question));
			$(question_and_responses).append($(radio_set));
			$(question_and_responses).append($(text_response));
			$(questions_container).append($(question_and_responses));
		});
		$(individual_container).append($(text_field_name));
		$(individual_container).append($(dropdown_position));
		$(individual_container).append($(questions_container));
		$("#survey-container").append($(individual_container));

	});
}