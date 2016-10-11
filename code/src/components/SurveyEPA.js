var React = require('react');
var ReactDOM = require('react-dom');

var SurveyQuestion = require('./SurveyQuestion');

var SurveyEPA = React.createClass({
	getInitialState: function() {
		return null;
	},

	render: function() {
		return (
			// for each question of the epa, render a SurveyQuestion
			<div>
				{ this.props.EPA.questions.map(function(question, index) { 
					return (<SurveyQuestion key={ 'question-' + index } prompt={ question.prompt } />); 
				})}
			</div>
		);
	}
});

module.exports = SurveyEPA;