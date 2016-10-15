var React = require('react');
var ReactDOM = require('react-dom');

var SurveyEPA = require('./SurveyEPA');
var Button = require('react-bootstrap/lib/Button');

var Survey = React.createClass({
	getInitialState: function() {
		// an ajax call will replace this
		return {
			EPAs: [
				{ name: "EPA 1", questions: [ { prompt: "The student greeted the patient in a kind, yet professional manner." }, { prompt: "The student used medical jargon when apppropriate." }, { prompt: "Question 1.3" }, { prompt: "Question 1.4" }, { prompt: "Question 1.5" }] },
				{ name: "EPA 2", questions: [ { prompt: "Question 2.1" }, { prompt: "Question 2.2" }, { prompt: "Question 2.3" }, { prompt: "Question 2.4" }, { prompt: "Question 2.5" }] },
				{ name: "EPA 3", questions: [ { prompt: "Question 3.1" }, { prompt: "Question 3.2" }, { prompt: "Question 3.3" }, { prompt: "Question 3.4" }, { prompt: "Question 3.5" }] }
			]
		}
	},

	render: function() {
		var surveyStyle = {
			margin: "20px",
			backgroundColor: "#99badd",
			padding: "20px",
			borderRadius: "4px"
		};

		var submitStyle = {
			width: "200px"
		};

		return (
			// for each epa selected, render a SurveyEPA

			<div style={surveyStyle} id="survey">
				{ 
					this.state.EPAs.map(function(EPA, index) { 
					return (<SurveyEPA key={ 'epa-' + index } EPA={ EPA } />); 
				})}
					<Button style={submitStyle} bsClass="btn-block btn-sucess btn-sm" type="submit">Submit</Button>			
			</div>
		);
	}
});

module.exports = Survey;