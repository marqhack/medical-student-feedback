var React = require('react');
var ReactDOM = require('react-dom');
var ActivityTable = require('./ActivityTable.js');

var SurveyConfig = React.createClass({
	render: function(){
		var activities = ["activity1", "epa2", "activity3"];

		return (
			<ActivityTable activities = {activities} />
		);
	}

});

module.exports = SurveyConfig;