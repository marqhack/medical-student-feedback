var pid = '';
$(document).ready(function() {
	add_action_listeners();

	$("#add-observer").click();
});

function add_action_listeners() {
	$("#login-button").on('click', function(e) {
		pid = $("#student-pid").val();
		if( pid == '' || pid.length != 9 || !($.isNumeric(pid)) ) {
			alert("Please enter a valid PID. A PID must be 9 digits.");
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
		$(this).removeClass('inactive');
		$(this).addClass('active');
	});

	$("#page-1").on('click', '.active' ,function() {
		$(this).removeClass('active');
		$(this).addClass('inactive');
	});

	$("body").on('click', '.confirm-email', function() {
		email_input = $(this).prev();
		confirm_button = $(this);
		if (!validate_email($(email_input).val())) {
			$(email_input).addClass('invalid');
		} else {
			$(email_input).removeClass('invalid');
			email = $.trim($(email_input).val());
			$.get('verfEmail?email=' + email , function(response) {
				if(response) {
					console.log(JSON.parse(response).evid);
					$(email_input).attr("evaluatorid", JSON.parse(response).evid);
					$(email_input).prop("disabled", true);
					$(confirm_button).prop("disabled", true);
				} else {
					if (confirm("" + email + " was not found. Click OK to add this email to the database. Click Cancel to try a different email.")) {
						post_obj = { email: email };
						$.post('/addEvaluator', JSON.stringify(post_obj), function() { $(confirm_button).click(); }, "JSON");
					
					}
				}

			});

			//enable activity selection buttons, on_device checkbox,
			//and confirm selections button once email is confirmed
			$('.activity-button').prop('disabled', false);
			$('input[type=checkbox]').prop('disabled', false);
			$('.confirm-selections').prop('disabled', false);
		}


	});

	$('body').on('click', '.confirm-selections', function(){
		parent_container = $(this).parents(".observer-info");
		confirm_selections(pid, $(parent_container));
		$(this).prop('disabled', true);

		//enable continue to surveys button
		$('#submit-observers').prop('disabled', false);
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

	$("#observers-container").on('blur', 'input[type=email]', function(){
		if (!validate_email($(this).val())) {
			alert('Please provide a valid email. ' + $(this).val() + ' is not a valid email address');
		}
	});

	//redirect to survey page for on device feedback
	//send emails to observers not taking on device
	$("#submit-observers").on('click', function() {
		var survey_info = get_observer_info();
		console.log(survey_info);

		if ($("input[type=email].invalid").length > 0) {
			alert('Please verify that all emails are valid.');
		} else {
			//if observer not giving feedback on device,
			//send email with link to survey
			
			for(var i = 0; i< survey_info.observer_info.length; i++){
				if(!survey_info.observer_info[i].on_device) {
					var url = $(location).attr('href');
					url = url.replace("survey.html", "remote-survey.html");
					var evid = survey_info.observer_info[i].evid;
					var activities = survey_info.observer_info[i].activities.join('-');
					var linkParams = "?pid=" + pid + "&evid=" + evid
						 + "&activities=" + activities;
					var to = survey_info.observer_info[i].email;
					var	subject = pid + " requests feedback";
					var text = "Link to survey: " + url + linkParams;
					
					$.get("sendEmail", {to:to, subject:subject, text:text}, function(data){

						if(data=="sent") {
							alert("email sent successfully");
						} else {
							alert("error sending email");
						}
					});
				}
			}

			$('.observer-panel').append($('<button class="observer-button inactive" id="observer-patient">Patient</button>'));
		}
		
		
		$("#page-1").hide();
		$("#page-2").show();
		// render_observer_panel();
		// render_surveys();		
	});

	$("body").on('click', '.observer-button.inactive', function(){
		//always render patient survey
		render_patient_survey();
		$('#patient-instructions').show();

		$('.observer-button').attr({ 'class': 'observer-button inactive' });
		$(this).attr({ 'class': 'observer-button active' });
		var id = $(this).prop('id').split('-')[1];
		show_survey(id);
		
	});


}

function add_observer_div() {
	var observer_info_container = $('<div class="observer-info">');
	var email = $('<div class="email">Email: <input type="email" placeholder="example@xyz.com"><button class="confirm-email">Confirm Email</button></div>');

	var activities_container = $('<div class="activities-container"></div>');
	$.get('test', function(activities_json) {
		console.log(activities_json);
		activities_json.forEach(function(activity) {	
			activities_container.append($('<button id="' + activity.aNum + '"" class="activity-button inactive" disabled = true>' + activity.aContent + '</button>'));
		});
	});

	
	var confirm_selections_button = $('<div><button class="confirm-selections" disabled=true>Confirm Selections</button></div>');
	var checkbox = $('<input type="checkbox" disabled=true><label>Taking survey on this device?</label>');
	var delete_button = $('<button class="delete-observer">Delete</button>');

	$(observer_info_container).append(email);
	$(observer_info_container).append($('<div id="instructions">Select all activities that this observer saw you perform.</div>'))
	$(observer_info_container).append(activities_container);
	$(observer_info_container).append(checkbox);
	$(observer_info_container).append(delete_button);
	$(observer_info_container).append(confirm_selections_button);
	$("#observers-container").append(observer_info_container);
}

function confirm_selections(pid, parent_container) {
	evaluator_id = $(parent_container).find($("input[type=email]")).attr("evaluatorid");
	var selected_activities = [];
	($(parent_container).find($(".active"))).each(function(index, activity) {
		selected_activities.push($(activity).prop('id'));
		console.log('button id = ' + $(activity).prop('id'));
	});

	api_call = 'getSurvey?pid=' + pid + '&evid=' + evaluator_id + '&activities=' + get_selected_activities(parent_container).join('-');
	$.get(api_call, function(response) {
		$(parent_container).attr('survey', response);
		add_to_observer_tabs(response);
		render_survey(response);		

		($(parent_container).find($(".activity-button"))).each(function(index, activity) {
			$(activity).prop('disabled', true);
		});
	});


	
}

function get_selected_activities(observer_container) {
	var selected_activities = [];
	($(observer_container).find($(".active"))).each(function(index, activity) {
		selected_activities.push($(activity).prop('id'));
		console.log('button id = ' + $(activity).prop('id'));
	});

	return selected_activities;
}

function get_observer_info() {
	var observer_info = [];
	$(".observer-info").each(function() {
		evaluator_id = '';
		var info = {
			evid: $(this).find($("input[type=email]")).attr("evaluatorid"),
			email: $(this).find($("input[type=email]")).val(),
			on_device: ($(this).find($("input[type=checkbox]"))).prop('checked')
		}

		info.activities = get_selected_activities($(this));
		observer_info.push(info);
	});

	var survey_request = {
		pid: pid,
		observer_info: observer_info
	}
	return survey_request;
}

function add_to_observer_tabs(survey_obj) {
	survey_obj = JSON.parse(survey_obj);
	$(".observer-panel").append($('<button class="observer-button inactive" id="observer-' + survey_obj.evid + '">' + (survey_obj.name || survey_obj.email) + '</button>'));
}

function render_observer_panel() {

	observer_divs = $('.observer-info');

	observer_panel = $('<div class="observer-panel">Observers: </div>');


	observer_divs.each(function(){
		survey = JSON.parse($(this).attr('survey'));
		observer_panel.append($('<button class="observer-button inactive" id="observer-' + survey.evid + '">' + (survey.name || survey.email) + '</button>'));
	});

	$("#survey-container").append(observer_panel);

	$(".observer-button.inactive").on('click', function(){
		$('.observer-button').attr({ 'class': 'observer-button inactive' });
		$(this).attr({ 'class': 'observer-button active' });
		var id = $(this).prop('id').split('-')[1];
		show_survey(id);
	});

}

function render_survey(survey_obj) {

	survey_obj = JSON.parse(survey_obj);
	individual_container = $('<div class="survey" id="survey-' + (survey_obj.evid) + '"></div>');
	text_field_name = $('<div class="observer-name">Name: <input type="text" value="' + (survey_obj.name || "") + '"></input></div>');
	dropdown_position = $('<div class="observer-position">Position: <select id="position"><option>Resident</option><option>Faculty</option><option>Patient</option></select>')
	questions_container = $('<div class="questions"></div>');
	survey_obj.activities.forEach(function(activity) {
		question_and_responses = $('<div class="question-and-responses"></div>');
		question_div = $('<div class="question">Level of Entrustability for ' + activity.aContent + '</div>');
		radio_set = $('<div class="radio-set"></div>');
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="0">N/A</input></div>'));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="1">' + activity.c1Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="2">' + activity.c2Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="3">' + activity.c3Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="4">' + activity.c4Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="5">' + activity.c5Content + "</input></div>"));
		text_response = $('<textarea class="comment" id="' + survey_obj.evid + '-' + activity.aNum + '" placeholder="Enter specific observations related to activity here."></textarea>');
		$(question_and_responses).append($(question_div));
		$(question_and_responses).append($(radio_set));
		$(question_and_responses).append($(text_response));
		$(questions_container).append($(question_and_responses));
	});
	$(individual_container).append($(text_field_name));
	$(individual_container).append($(dropdown_position));
	$(individual_container).append($(questions_container));
	$(individual_container).append($('<button id="submit-' + survey_obj.evid + '">Submit survey for ' + (survey_obj.name || survey_obj.email) + '</button>'));
	$(individual_container).attr("hidden", "true");
	$("#survey-container").append($(individual_container));

}

function render_patient_survey() {
	//survey_obj = JSON.parse(survey_obj);
	individual_container = $('<div class="survey" id="survey-patient"></div>');
	instructions_container = $('#patient-instructions');
	instructions_container.show();
	questions_container = $('<div class="questions"></div>');
	//retrieve patient questions from a survey object


	//current: hard coded survey --->
	question_and_responses = $('<div class="question-and-responses"></div>');
	question_div = $('<div class="question">Question:</div>');
	radio_set = $('<div class="radio-set"></div>');
	$(radio_set).append($('<div class="radio-div"><input type="radio" value="0">N/A</input></div>'));
	$(radio_set).append($('<div class="radio-div"><input type="radio" value="1">1 = poorly/incompletely</input></div>'));
	$(radio_set).append($('<div class="radio-div"><input type="radio" value="2">2</input></div>'));
	$(radio_set).append($('<div class="radio-div"><input type="radio" value="3">3 = average</input></div>'));
	$(radio_set).append($('<div class="radio-div"><input type="radio" value="4">4</input></div>'));
	$(radio_set).append($('<div class="radio-div"><input type="radio" value="5">5 = excellently/completely</input></div>'));
	$(question_and_responses).append($(question_div));
	$(question_and_responses).append($(radio_set));
	$(questions_container).append($(question_and_responses));
	$(individual_container).append($(instructions_container));
	$(individual_container).append($(questions_container));
	$(individual_container).append($('<button id="submit-patient">Submit survey for Patient</button>'));
	$(individual_container).attr("hidden", "true");
	$("#survey-container").append($(individual_container));
}

function show_survey(id){
	console.log("show survey id: " + id);
	$(".survey").hide();	
	var survey_id = "survey-" + id;
	$("#"+survey_id).show();
}

function validate_email(email) {
    var reg_ex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg_ex.test(email);
}
