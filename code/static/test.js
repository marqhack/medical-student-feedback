var pid = '';
$(document).ready(function() {

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
						$.post('api/addEvaluator', JSON.stringify(post_obj), function() { $(confirm_button).click(); }, "JSON");
					
					}
				}

			});
		}
	});

	$('body').on('click', '.confirm-selections', function(){
		parent_container = $(this).parents(".observer-info");
		confirm_selections(pid, $(parent_container));
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
		var observer_info = get_observer_info();

		if ($("input[type=email].invalid").length > 0) {
			alert('Please verify that all emails are valid.');
		} else {

			//if observer not giving feedback on device,
			//send email with link to survey
			for(var i = 0; i< observer_info.length; i++){
				if(!observer_info[i].on_device){
					var to = observer_info[i].email;
					var subject = pid + " requests feedback";
					var text = "URL TO SURVEY GOES HERE";
					$.get("http://localhost:3000/sendEmail", {to:to, subject:subject, text:text}, function(data){
						if(data=="sent"){
							alert("email sent successfully");
						}else{
							alert("error sending email");
						}
					});
				}
			}
		}
		
		
		$("#page-1").hide();
		$("#page-2").show();
		render_observer_panel();
		render_surveys();		
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
	


	var confirm_selections_button = $('<div><button class="confirm-selections">Confirm Selections</button></div>');
	var checkbox = $('<input type="checkbox"><label>Taking survey on this device?</label>');
	var delete_button = $('<button class="delete-observer">Delete</button>');

	$(observer_info_container).append(email);
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

	api_call = 'api/getSurvey?pid=' + pid + '&evid=' + evaluator_id + '&activities=' + selected_activities.join('-');
	$.get(api_call, function(response) {
		$(parent_container).attr('survey', response);
		console.log(response);
	});
	
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

	return observer_info;
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

function render_surveys() {

	observer_divs = $('.observer-info');

	observer_divs.each(function() {
		survey = JSON.parse($(this).attr('survey'));
		individual_container = $('<div class="survey" id="survey-' + (survey.evid) + '"></div>');
		text_field_name = $('<div class="observer-name">Name: <input type="text" value="' + (survey.name || "") + '"></input></div>');
		dropdown_position = $('<div class="observer-position">Position: <select id="position"><option>Resident</option><option>Faculty</option><option>Patient</option></select>')
		questions_container = $('<div class="questions"></div>');
		console.log(survey);
		// extracted_choices = extract_choices(survey, choices_json);
		survey.activities.forEach(function(activity) {
		// 	console.log(activity_id);
			question_and_responses = $('<div class="question-and-responses"></div>');
			question_div = $('<div class="question">' + activity.aContent + '</div>');
			radio_set = $('<div class="radio-set"></div>');
			$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.evid + '-' + activity.aNum + '" value="0">N/A</input></div>'));
			$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.evid + '-' + activity.aNum + '" value="1">' + activity.c1Content + "</input></div>"));
			$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.evid + '-' + activity.aNum + '" value="2">' + activity.c2Content + "</input></div>"));
			$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.evid + '-' + activity.aNum + '" value="3">' + activity.c3Content + "</input></div>"));
			$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.evid + '-' + activity.aNum + '" value="4">' + activity.c4Content + "</input></div>"));
			$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey.evid + '-' + activity.aNum + '" value="5">' + activity.c5Content + "</input></div>"));
			text_response = $('<textarea class="comment" id="' + survey.evid + '-' + activity.aNum + '"></textarea>');
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

function extract_choices(survey_info, choices_json) {
	extracted_choices = { };
	activity_ids = new Set(survey_info.activities);
	JSON.parse(choices_json).forEach(function(activity) {
		if (activity_ids.has(activity.aNum.toString())) {
			extracted_choices['' + activity.aNum.toString()] = 'blah';
		}
	});

	console.log(extracted_choices);
}

function show_survey(id){
	console.log("show survey id: " + id);
	var survey_id = "survey-" + id;
	$(".survey").hide();
	$("#"+survey_id).show();
}

function validate_email(email) {
    var reg_ex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg_ex.test(email);
}