$(document).ready(function() {
	var activities = ['Verbal Communication', 'Physical Exam', 'Patient History', 'Patient Handoff', 'Something Else'];

	// render_observers_panel();
	$("#page-1").on('click', '.inactive' ,function() {
		console.log("inactive clicked");
		$(this).attr({ 'class': 'active' });
	});

	$("#page-1").on('click', '.active' ,function() {
		console.log("active clicked");
		$(this).attr({ 'class': 'inactive' });
	});

	$("#add-observer").on('click', function() {
		add_observer_div(activities);
	});

	$("#submit-observers").on('click', function() {
		get_observer_info();
		// $("#page-1").hide();
		// $("#page-2").show();
	});

	$("#submit-emails").on('click', function() {
		$("#page-2").hide();
		$("#page-3").show();
	});


	$("#add-observer").click();
});

function render_activities_table(activities) {
	console.log(activities);
}

function add_observer_div(activities) {
	var observer_info_container = $('<div class="observer-info">');
	var email = $('<div>Email: <input type="email" placeholder="example@xyz.com"></div>');

	var activities_container = $('<div class=".activities-container"></div>');
	$.get('api/test', function(activities_json) {
		activities_json.forEach(function(activity) {
			console.log(activity);	
			activities_container.append($('<button id="' + activity.aNum + '"" class="inactive">' + activity.aContent + '</button>'));
		});
		// console.log(activities_json);
	});
	

	var checkbox = $('<div><input type="checkbox">Yes, I am taking survey on this device</div>');

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
