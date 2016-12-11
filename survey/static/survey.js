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
		} else if(is_duplicate_email($(email_input).val())) {
			alert('You have already entered that email.');
			$(email_input).addClass('invalid');
		} else {
			$(email_input).removeClass('invalid');
			email = $.trim($(email_input).val());
			$.get('./verfEmail?email=' + email , function(response) {
				if(response) {
					$(email_input).attr("evaluatorid", JSON.parse(response).evid);
					$(email_input).prop("disabled", true);
					$(confirm_button).prop("disabled", true);
				} else {
					if (confirm("" + email + " was not found. Click OK to add this email to the database. Click Cancel to try a different email.")) {
						post_obj = { email: email };
						$.post('./addEvaluator', post_obj, function() { $(confirm_button).click(); }, "JSON");
					
					}
				}

			});

			//enable activity selection buttons, on_device checkbox,
			//and confirm selections button once email is confirmed
			$('.activity-button').prop('disabled', false);
			$('input[type=checkbox]').prop('disabled', false);
			// $('.confirm-selections').prop('disabled', false);
		}


	});

	// $('body').on('click', '.confirm-selections', function(){
	// 	parent_container = $(this).parents(".observer-info");
	// 	confirm_selections(pid, $(parent_container));
	// 	$(this).prop('disabled', true);

	// 	//enable continue to surveys button
	// 	$('#submit-observers').prop('disabled', false);
	// });

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

	//redirect to survey page for on device feedback
	//send emails to observers not taking on device
	$("#submit-observers").on('click', function() {
		var survey_info = get_observer_info();

		continue_to_surveys = true;

		if ($("input[type=email].invalid").length > 0) {
			alert('Please verify that all emails are valid.');
		} else {
			//if observer not giving feedback on device,
			//send email with link to survey

			$('.observer-info').each(function () {
				if(confirm_selections(pid, $(this)) == false) {
					continue_to_surveys = false;
				}
			});

			if (continue_to_surveys) {
				$.get('getSurvey?pid=' + pid + '&evid=1&activities=' + get_all_selected_activities().join('-'), function(response) {
					add_to_observer_tabs(response);
					render_survey(response);
				});

				$("#page-1").hide();
				$("#page-2").show();
			

				//always render patient survey
				if($("#render-patient-survey").prop('checked')) {
					$('.observer-panel').append($('<button class="observer-button inactive" id="observer-0">Patient</button>'));
						
					//making api call to getPatientQuestions
					api_call = 'getPatientQuestions';
					$.get(api_call, function(response) {
						render_patient_survey(response);
					});

					//render_patient_survey();
				}
				// render_observer_panel();
				// render_surveys();	
			}	
		};
	});

	$("body").on('click', '.observer-button.inactive', function(){
		$('.observer-button').attr({ 'class': 'observer-button inactive' });
		$(this).attr({ 'class': 'observer-button active' });
		var id = $(this).prop('id').split('-')[1];
		show_survey(id);
		
	});

	$("body").on('click', '.survey-submit', function() {
		this_survey = $(this).parents('.survey');
		survey_response = collect_response(this_survey);
		if (survey_response != false) {
			$.post('./logAssessment', survey_response, function(){ console.log("i think it was logged successfully"); }, "JSON");
		} else {
			alert('Survey is not complete. Make sure you have filled in your name, selected a position, and evaluated each activity.');
		}
		
	});

	$("body").on('click', '#submit-patient', function() {
		patient_survey = $(this).parents('.survey');
		survey_response = collect_patient_response(patient_survey);
		if (survey_response != false) {
			$.post('./logAssessment', survey_response, function(){ console.log("i think it was logged successfully"); }, "JSON");
		} else {
			alert('Survey is not complete. Make sure you have answered each question.');
		}
	});
}

function add_observer_div() {
	var observer_info_container = $('<div class="observer-info">');
	var email = $('<div class="email">Email: <input type="email" placeholder="example@xyz.com"><button class="confirm-email">Confirm Email</button></div>');

	var activities_container = $('<div class="activities-container"></div>');
	$.get('./test', function(activities_json) {
		activities_json.forEach(function(activity) {	
			activities_container.append($('<button id="' + activity.aNum + '"" class="activity-button inactive" disabled = true>' + activity.aContent + '</button>'));
		});
	});

	
	// var confirm_selections_button = $('<div><button class="confirm-selections" disabled=true>Confirm Selections</button></div>');
	var checkbox = $('<input type="checkbox" disabled=true><label>Taking survey on this device?</label>');
	var delete_button = $('<button class="delete-observer">Delete</button>');

	$(observer_info_container).append(email);
	$(observer_info_container).append($('<div id="instructions">Select all activities that this observer saw you perform.</div>'))
	$(observer_info_container).append(activities_container);
	$(observer_info_container).append(checkbox);
	$(observer_info_container).append(delete_button);
	// $(observer_info_container).append(confirm_selections_button);
	$("#observers-container").append(observer_info_container);
}

function confirm_selections(pid, parent_container) {
	evaluator_id = $(parent_container).find($("input[type=email]")).attr("evaluatorid");
	var selected_activities = [];
	($(parent_container).find($(".active"))).each(function(index, activity) {
		selected_activities.push($(activity).prop('id'));
	});

	selected_activities = get_selected_activities(parent_container);
	if (selected_activities.length != 0) {
		if (!$(parent_container).attr('processed')) {
			if ($(parent_container).find($('input[type=checkbox]')).prop('checked')) {
				api_call = 'getSurvey?pid=' + pid + '&evid=' + evaluator_id + '&activities=' + selected_activities.join('-');
				$.get(api_call, function(response) {
					// $(parent_container).attr('survey', response);
					add_to_observer_tabs(response);
					render_survey(response);		

					($(parent_container).find($(".activity-button"))).each(function(index, activity) {
						$(activity).prop('disabled', true);
					});
				});
			} else {
				url = $(location).attr('href').split('survey/')[0] + 'survey/remote-survey.html?pid=' + pid + '&evid=' + evaluator_id + '&activities=' + selected_activities.join('-');
				to = $(parent_container).find($("input[type=email]")).val();
				subject = pid + " requests feedback";
				text = "Link to survey: " + url;
				
				$.get("./sendEmail", {to:to, subject:subject, text:text}, function(data){

					if(data=="sent") {
						alert("email sent successfully");
					} else {
						alert("error sending email");
					}
				});
			}

			$(parent_container).attr('processed', true);
		}
	} else {
		alert("Each observer must have at least one activity marked as \"observed\"");
		return false;
	}
}

function get_selected_activities(observer_container) {
	var selected_activities = [];
	($(observer_container).find($(".active"))).each(function(index, activity) {
		selected_activities.push($(activity).prop('id'));
	});

	if (selected_activities.length == 0) {

	} else {

	}
	return selected_activities;
}

function get_all_selected_activities() {
	var all_selected_activities = new Set();
	$('.activity-button.active').each(function(index, activity) {
		all_selected_activities.add($(activity).prop('id'));
	});

	return Array.from(all_selected_activities);
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
	if (survey_obj.evid == 1) {
		tab_name = 'Self Evaluation';
	} else if (survey_obj.last_name != null || survey_obj.last_name != undefined) {
		tab_name = survey_obj.last_name;
	} else {
		tab_name = survey_obj.email;
	}
	$(".observer-panel").append($('<button class="observer-button inactive" id="observer-' + survey_obj.evid + '">' + (tab_name) + '</button>'));
}

// function render_observer_panel() {

// 	observer_divs = $('.observer-info');

// 	observer_panel = $('<div class="observer-panel">Observers: </div>');


// 	observer_divs.each(function(){
// 		survey = JSON.parse($(this).attr('survey'));
// 		observer_panel.append($('<button class="observer-button inactive" id="observer-' + survey.evid + '">' + (survey.last_name || survey.email) + '</button>'));
// 	});

// 	$("#survey-container").append(observer_panel);

// 	$(".observer-button.inactive").on('click', function(){
// 		$('.observer-button').attr({ 'class': 'observer-button inactive' });
// 		$(this).attr({ 'class': 'observer-button active' });
// 		var id = $(this).prop('id').split('-')[1];
// 		show_survey(id);
// 	});

// }

function render_survey(survey_obj) {
	survey_obj = JSON.parse(survey_obj);
	individual_container = $('<div class="survey" id="survey-' + (survey_obj.evid) + '"></div>');
	text_field_name = $('<div class="observer-name">First Name: <input class="first-name" type="text" value="' + (survey_obj.first_name || "") + '" required></input>Last Name: <input class="last-name" type="text" value="' + (survey_obj.last_name || "") + '" required></input></div>'); 
	if ((survey_obj.first_name != null) && (survey_obj.last_name != null)) {
		$(text_field_name).find('input[type=text]').prop('disabled', true);
	} 
	dropdown_position = $('<div class="observer-position">Position: <select id="position" required><option>Select Position</option><option>Resident</option><option>Faculty/Staff</option><option>Attending</option></select>')
	questions_container = $('<div class="questions"></div>');
	survey_obj.activities.forEach(function(activity) {
		question_and_responses = $('<div class="question-and-responses" activity_number=' + activity.aNum + '></div>');
		question_div = $('<div class="question">Level of Entrustability for ' + activity.aContent + '</div>');
		radio_set = $('<div class="radio-set"></div>');
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="0" required>N/A</input></div>'));
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
	if (survey_obj.evid == 1) {
		$(text_field_name).prop('hidden', 'true');
		$(dropdown_position).prop('hidden', 'true');
	}
	$(individual_container).append($(text_field_name));
	$(individual_container).append($(dropdown_position));
	$(individual_container).append($(questions_container));
	$(individual_container).append($('<button class="survey-submit" id="submit-' + survey_obj.evid + '">Submit</button>'));
	$(individual_container).attr("hidden", "true");
	$("#survey-container").append($(individual_container));
}

function render_patient_survey(survey_obj) {
	patient_evid = 0;
	individual_container = $('<div class="survey" id="survey-' + (patient_evid) + '"></div>');
	instructions_container = $('#patient-instructions');
	instructions_container.show();
	questions_container = $('<div class="questions"></div>');
	//retrieve patient questions from a survey object

	survey_obj.forEach(function(question) {
		question_and_responses = $('<div class="question-and-responses" question_number=' + question.pqNum + '></div>');
		question_div = $('<div class="question">' + question.pqContent +'</div>');
		radio_set = $('<div class="radio-set"></div>');
		
		$(question_and_responses).append($(question_div));
		if(question.choice1 == null){
			text_response = $('<textarea class ="comment" id="' + patient_evid + '-' + question.pqNum + '"</textarea>');
			$(question_and_responses).append($(text_response));
		}else{
			if(question.choice1 != null){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + patient_evid + '-' + question.pqNum + '" value="1">' + question.choice1 + '</input></div>'));
			}
			if(question.choice2 != null){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + patient_evid + '-' + question.pqNum + '" value="2">' + question.choice2 + '</input></div>'));
			}
			if(question.choice3 != null){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + patient_evid + '-' + question.pqNum + '" value="3">' + question.choice3 + '</input></div>'));
			}
			if(question.choice4 != null){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + patient_evid + '-' + question.pqNum + '" value="4">' + question.choice4 + '</input></div>'));
			}
			if(question.choice5 != null){
				$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + patient_evid + '-' + question.pqNum + '" value="5">' + question.choice5 + '</input></div>'));
			}
			$(question_and_responses).append($(radio_set));
		}		
		
		
		$(questions_container).append($(question_and_responses));
					
		
	});


	$(individual_container).append($(instructions_container));
	$(individual_container).append($(questions_container));
	$(individual_container).append($('<button id="submit-patient">Submit</button>'));
	$(individual_container).attr("hidden", "true");
	$("#survey-container").append($(individual_container));
}

function show_survey(id){
	$(".survey").hide();	
	var survey_id = "survey-" + id;
	$("#"+survey_id).show();
}

function validate_email(email) {
    var reg_ex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg_ex.test(email);
}

function is_duplicate_email(email) {
	is_duplicate = false;
	$('input[type=email]').filter(function(index) {
		return $(this).prop('disabled') == true;
	}).each(function() {
		if (email == $(this).val()) {
			is_duplicate = true;
		}
	});

	return is_duplicate;
}

function collect_response(survey_jquery) {
	survey_response = {};
	question_responses = [];
	survey_response.pid = pid;
	survey_response.evaluator_id = $(survey_jquery).prop('id').split('-')[1];
	survey_response.evaluator_fname = $(survey_jquery).find('.first-name').val();
	survey_response.evaluator_lname = $(survey_jquery).find('.last-name').val();
	survey_response.evaluator_type = (survey_response.evaluator_id == 1) ? 'na' : $(survey_jquery).find('#position').val();
	$(survey_jquery).find('.question-and-responses').each(function() {
		answer = {};
		answer.activity_id = $(this).attr('activity_number');
		answer.choice = $(this).find('input[type=radio]:checked').val();
		answer.comment = $(this).find('.comment').val();
		question_responses.push(answer);
	});
	survey_response.responses = question_responses;
	is_completed = true;
	$.each(survey_response, function(key, value) {
    	if (value == null || value == '' || value == "Select Position") {
    		is_completed = false;
    	}

    	if (key == 'responses') {
    		value.forEach(function(activity) {
    			if (activity.choice == undefined || activity.choice == null) {
    				is_completed = false;
    			}
    		});
    	}
	});
	 
	if (is_completed){
		$(survey_jquery).empty();
		$(survey_jquery).append('<p style="text-align: center;">Thank you for your feedback!</p>');
		return survey_response;
	} else {
		return false;
	}
}

function collect_patient_response(survey_jquery) {
	survey_response = {};
	question_responses = [];
	survey_response.pid = pid;
	survey_response.evaluator_id = 0;

	$(survey_jquery).find('.question-and-responses').each(function() {
		answer = {};

		//activity_id is being used in place of question_number
		//evid of 0 will notify db handler to query patient_responses table
		//instead of activities table
		answer.activity_id = $(this).attr('question_number');


		answer.choice = $(this).find('input[type=radio]:checked').val();
		answer.comment = $(this).find('.comment').val();
		//if radio button, set comment to null
		//else if text response, set choice to 0
		if(answer.comment == undefined){
			answer.comment = "";
		}else{
			answer.choice = "0";
		}
		question_responses.push(answer);
	});
	survey_response.responses = question_responses;
	is_completed = true;
	$.each(survey_response, function(key, value) {
		if(key == 'responses') {
			value.forEach(function(question) {
				if(question.choice == undefined || question.choice == null) {
					is_completed = false;
				}
			});
		}
	});

	if (is_completed) {
		$(survey_jquery).empty();
		$(survey_jquery).append('<p style="text-align: center";>Thank you for your feedback! Please wash your hands after handing the device back to the student.</p>');
		return survey_response;
	} else{
		return false;
	}

}
