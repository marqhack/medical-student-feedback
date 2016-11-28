$(document).ready(function() {
	var pid = '';
	$("#login-button").on('click', function(e) {
		pid = $("#student-pid").val();
		if( pid == '' || pid.length != 9 || !($.isNumeric(pid)) ) {
			alert("Please enter a valid PID. A PID is a 9 digit number.");
		} else {
			$("#login-page").attr("hidden", "true");
			$("#login-page").hide();
			$("#page-1").show();
			$("#observers-container").prepend('<div id="welcome">Welcome, ' + pid + '</div>');
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

	$("body").on('click', '.confirm-email', function() {
		email_input = $(this).prev();
		confirm_button = $(this);
		if (!validate_email($(email_input).val())) {
			$(email_input).addClass('invalid');
		} else {
			$(email_input).removeClass('invalid');
			email = $.trim($(email_input).val());
			$.get('api/verfEmail?email=' + email , function(response) {
				if(response) {
					console.log(JSON.parse(response).evid);
					$(email_input).attr("evaluatorid", JSON.parse(response).evid);
					$(email_input).prop("disabled", true);
					$(confirm_button).prop("disabled", true);
				} else {
					if (confirm("" + email + " was not found. Click OK to add this email to the database (you will still need to click Confirm). Click Cancel to try a different email.")) {
						post_obj = { email: email };
						console.log(email);
						$.post('api/addEvaluator', JSON.stringify(post_obj), function() { console.log("succeeded"); }, "JSON");
					
					}
				}

			});
		}
	});

	$("#add-observer").on('click', function() {
		add_observer_div();
	});

	$("#observers-container").on('click', '.delete-observer', function() {
		if ($(".observer-info").length == 1) {
			alert("You must provide information for at least one observer.");
		} else {
			$(this).parents(".observer-info").remove();
		}
	});

	$("#submit-observers").on('click', function() {
		if ($("input[type=email].invalid").length > 0) {
			alert('Please verify that all emails are valid.');
		} else {
			get_observer_info(pid);
			$("#page-1").hide();
			$("#page-2").show();
		}
	});

	$("#add-observer").click();

});

function render_activities_table(activities) {
	console.log(activities);
}

function add_observer_div() {
	var observer_info_container = $('<div class="observer-info">');
	var email = $('<div class="email">Email: <input type="email" placeholder="example@xyz.com"><button class="confirm-email">Confirm Email</button></div>');

	var activities_container = $('<div class="activities-container"></div>');
	$.get('api/test', function(activities_json) {
		activities_json.forEach(function(activity) {
			//console.log(activity);	
			activities_container.append($('<button id="' + activity.aNum + '"" class="inactive">' + activity.aContent + '</button>'));
		});
	});
	

	var checkbox = $('<div class="checkbox"><input type="checkbox">Taking survey on this device?</div>');
	var delete_button = $('<div><button class="delete-observer">Delete</button></div');

	$(observer_info_container).append(email);
	$(observer_info_container).append(activities_container);
	$(observer_info_container).append(checkbox);
	$(observer_info_container).append(delete_button);
	$("#observers-container").append(observer_info_container);
}

function get_observer_info(pid) {
	var observer_info = [];
	$(".observer-info").each(function() {
		evaluator_id = '';
		var info = {
			evid: $(this).find($("input[type=email]")).attr("evaluatorid"),
			on_device: ($(this).find($("input[type=checkbox]"))).prop('checked')
		}
		var selected_activities = [];
		($(this).find($(".active"))).each(function(index, activity) {
			selected_activities.push($(activity).prop('id'));
		});
		info.activities = selected_activities;
		observer_info.push(info);
	});
	var survey_request = {
		pid: pid,
		observer_info: observer_info
	}
	console.log(survey_request);
	render_observer_panel(survey_request);
}

function render_observer_panel(survey_request){
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

	render_survey(survey_request);

}

function render_survey(survey_request) {
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
			question_div = $('<div class="question">' + question + '</div>');
			radio_set = $('<div class="radio-set"></div>');
			radio_text = ["0", "1", "2", "3", "4", "5"];
			radio_text.forEach(function(text, index){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.observerId + '-' + question + '" value="' + index + '">' + text + "</input></div>"));
			});
			text_response = $('<textarea class="comment" id="' + survey.observerId + '-' + question + '"></textarea>');
			$(question_and_responses).append($(question_div));
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

function validate_email(email) {
    var reg_ex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg_ex.test(email);
}