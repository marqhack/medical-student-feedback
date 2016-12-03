$(document).ready(function() {
	url = $(location).attr('href');
	console.log(url);
	query = 'api/getSurvey' + url.split('html')[1];
	console.log(query);

	$.get(query, function(response) {
		render_survey(response);
	});
});


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

function render_survey(survey_obj) {

	survey = JSON.parse(survey_obj);
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

}

function show_survey(id){
	console.log("show survey id: " + id);
	var survey_id = "survey-" + id;
	$(".survey").hide();
	$("#"+survey_id).show();
}