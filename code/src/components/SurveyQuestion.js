// each question is going to need a key
// the key will tell make sure that each question is displayed in the right order
// and that the answers will be sent off in the correct order
// the correct text will be displayed via the prompts property

var React = require('react');
var ReactDOM = require('react-dom');
var Radio = require('react-bootstrap/lib/Radio');
var FormGroup = require('react-bootstrap/lib/FormGroup');

var SurveyQuestion = React.createClass({
	getInitialState: function() {
		return null;
	},

	render: function() {
		var questionRadioContainerStyle = {
			paddingLeft: "20px",
			paddingTop: "10px",
			margin: "0 20px" 
		};

		return(
			<div style={questionRadioContainerStyle} className="question-radio-container">
				<div className="survey-question-prompt">
					{ this.props.prompt }
				</div>
				<FormGroup>
					<Radio inline>0</Radio>
					<Radio inline>1</Radio>
					<Radio inline>2</Radio>
					<Radio inline>3</Radio>
					<Radio inline>4</Radio>
					<Radio inline>5</Radio>
				</FormGroup>
			</div>
		)
	}
});

module.exports = SurveyQuestion;