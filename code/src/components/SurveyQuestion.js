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
		return {
			selectedOption: ''
		}
	},

	handleOptionChange: function(e){
		this.setState({selectedOption: e.target.value});
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
					<Radio value="option0" inline checked={this.state.selectedOption === "option0"}
					onChange = {this.handleOptionChange}
					>0</Radio>
					<Radio value="option1" inline checked={this.state.selectedOption === "option1"}
					onChange = {this.handleOptionChange}
					>1</Radio>
					<Radio value="option2" inline checked={this.state.selectedOption === "option2"}
					onChange = {this.handleOptionChange}
					>2</Radio>
					<Radio value="option3" inline checked={this.state.selectedOption === "option3"}
					onChange = {this.handleOptionChange}
					>3</Radio>
					<Radio value="option4" inline checked={this.state.selectedOption === "option4"}
					onChange = {this.handleOptionChange}
					>4</Radio>
					<Radio value="option5" inline checked={this.state.selectedOption === "option5"}
					onChange = {this.handleOptionChange}
					>5</Radio>
				</FormGroup>
			</div>
		)
	}
});

module.exports = SurveyQuestion;