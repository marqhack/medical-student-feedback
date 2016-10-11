var React = require('react');
var ReactDOM = require('react-dom');

var SurveyEPA = require('./SurveyEPA');

var Survey = React.createClass({
	getInitialState: function() {
		// an ajax call will replace this
		return {
			EPAs: [
				{ name: "EPA 1", questions: [ { prompt: "Question 1.1" }, { prompt: "Question 1.2" }, { prompt: "Question 1.3" }, { prompt: "Question 1.4" }, { prompt: "Question 1.5" }] },
				{ name: "EPA 2", questions: [ { prompt: "Question 2.1" }, { prompt: "Question 2.2" }, { prompt: "Question 2.3" }, { prompt: "Question 2.4" }, { prompt: "Question 2.5" }] },
				{ name: "EPA 3", questions: [ { prompt: "Question 3.1" }, { prompt: "Question 3.2" }, { prompt: "Question 3.3" }, { prompt: "Question 3.4" }, { prompt: "Question 3.5" }] }
			]
		}
	},

	render: function() {
		return (
			// for each epa selected, render a SurveyEPA

			<div id="survey">
				{ 
					this.state.EPAs.map(function(EPA, index) { 
					return (<SurveyEPA key={ 'epa-' + index } EPA={ EPA } />); 
				})}			
			</div>
		);
	}
});

module.exports = Survey;