$(document).ready(function() {

	$("#login-button").on('click', function(e){
		var pid = $("#student-pid").val();
		if( pid == '' || pid.length != 9 || !($.isNumeric(pid)) ){
			alert("Not a valid PID");
		}else{
			$("#login-page").attr("hidden", "true");
			$("#login-page").hide();
			$("#page-1").show();
			$("#observers-container").prepend('<div id="welcome">Welcome, ' +pid+'</div>');
		}
		
	});

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
		render_observer_panel();
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
	console.log(observer_info);
}

function render_observer_panel(){
	var fake_survey_response = [
    	{ "observerId": 1, "name":"Bob Doctor", "questions": ["History-Taking","Physical Exam","Writing Orders"]},
    	{ "observerId": 2, "name":"Tim Intern", "questions": ["Patient Handover","Physical Exam","Differential Diagnosis"]},
    	{ "observerId": 3, "name":"Peri Professional", "questions": ["Writing Prescriptions","Physical Exam","Management Exam"]}
	]

	observer_panel = $('<div class="observer-panel">Observers: </div>');

	fake_survey_response.forEach(function(survey){
		observer_panel.append($('<button class="observer-button inactive" id="observer-'+survey.observerId+'">'+ survey.name +'</button>'));
	});

	$("#survey-container").append(observer_panel);
	$(".observer-button.inactive").on('click', function(){
		$('.observer-button').attr({ 'class': 'observer-button inactive' });
		$(this).attr({ 'class': 'observer-button active' });
		var id = this.id;
		show_survey(id);
	});

}

function render_survey(id) {
	var fake_survey_response = [
    	{ "observerId": 1, "name":"Bob Doctor", "questions": ["History-Taking","Physical Exam","Writing Orders"]},
    	{ "observerId": 2, "name":"Tim Intern", "questions": ["Patient Handover","Physical Exam","Differential Diagnosis"]},
    	{ "observerId": 3, "name":"Peri Professional", "questions": ["Writing Prescriptions","Physical Exam","Management Exam"]}
	]
	

	fake_survey_response.forEach(function(survey) {
		individual_container = $('<div class="survey" id="survey-observer-'+survey.observerId+'"></div>');
		text_field_name = $('<div class="observer-name">Name: <input type="text" value="' + survey.name + '"></input></div>');
		dropdown_position = $('<div class="observer-position">Position: <select id="position"><option>Resident</option><option>Faculty</option><option>Patient</option></select>')
		questions_container = $('<div class="questions"></div>');
		survey.questions.forEach(function(question) {
			question_and_responses = $('<div class="question-and-responses"></div>');
			question = $('<div class="question">' + question + '</div>');
			radio_set = $('<div class="radio-set"></div>');
			radio_text = ["0", "1", "2", "3", "4", "5"];
			radio_text.forEach(function(text, index){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.observerId + '-' + question + '" value="' + index + '">' + text + "</input></div>"));
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
		$(individual_container).attr("hidden", "true");
	});

}

function show_survey(id){
	var survey_id = "survey-" + id;
	$(".survey").hide();
	$("#"+survey_id).show();
}