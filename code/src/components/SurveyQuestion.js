// each question is going to need a key
// the key will tell make sure that each question is displayed in the right order
// and that the answers will be sent off in the correct order
// the correct text will be displayed via the prompts property

var React = require('react');
var ReactDOM = require('react-dom');

var SurveyQuestion = React.createClass({
	getInitialState: function() {
		return null;
	},

	render: function() {
		return(
			<div>
				<div className="survey-question-prompt">
					{ this.props.prompt }
				</div>
				<div className="survey-question-radios">
					<input type="radio" name="survey-question-answers" value="0" /> 0
					<input type="radio" name="survey-question-answers" value="1" /> 1
					<input type="radio" name="survey-question-answers" value="2" /> 2
					<input type="radio" name="survey-question-answers" value="3" /> 3
					<input type="radio" name="survey-question-answers" value="4" /> 4
					<input type="radio" name="survey-question-answers" value="5" /> 5
				</div>
			</div>
		)
	}
});

module.exports = SurveyQuestion;