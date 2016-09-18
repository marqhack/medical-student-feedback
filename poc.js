$(document).ready(function() {
	$("#submit").on('click', function() {
		var text = $("#q1").val();
		var radio = $("input[name='q2']:checked").val();
		var checked = $("#q3").prop("checked");

		$("#response").text("Here are your responses:\nq1: " + text + "\nq2: " + radio + "\nq3: " + checked);
	});
});