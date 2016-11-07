var React = require('react');
var ReactDOM = require('react-dom');
var SurveyPanel = require('./SurveyPanel');


var SurveyPage = React.createClass({


	render: function(){
		var observers = ["intern", "resident", "professional", "patient", "self"];

		return (
			<SurveyPanel observers = {observers} />
		);
	}

});

module.exports = SurveyPage;