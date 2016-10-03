var React = require('react');
var ReactDOM = require('react-dom');

var AddEPA = React.createClass({
	handleClick: function(e) {
		var obj = {
			name: document.getElementById('name').value,
			description: document.getElementById('description').value,
			questions: []
		}
		questions = document.getElementsByClassName('enter-question');
		for (var i = 0; i < questions.length; i++) {
			obj.questions.push(questions.item(i).value);
		}

		console.log(JSON.stringify(obj));
		console.log(document.getElementsByClassName('enter-question'));
	},

	render: function() {
		return(
			<div id="epa-container">
				<h3>Add a new EPA</h3>
				<div>
					<label htmlFor="name">Name: </label>
					<input type="textbox" id="name" />
				</div>

				<div id="description-div">
					<label htmlFor="description">Description: </label>
					<textarea id="description" />
				</div>

				<div>
					Question 1: 
					<input className="enter-question" type="textbox" id="question-1" />
				</div>

				<div>
					Question 2: 
					<input className="enter-question" type="textbox" id="question-2" />
				</div>

				<div>
					Question 3: 
					<input className="enter-question" type="textbox" id="question-3" />
				</div>

				<div>
					Question 4: 
					<input className="enter-question" type="textbox" id="question-4" />
				</div>

				<div>
					Question 5: 
					<input className="enter-question" type="textbox" id="question-5" />
				</div>

				<div>
					Question 6: 
					<input className="enter-question" type="textbox" id="question-6" />
				</div>

				<div>
					Question 7: 
					<input className="enter-question" type="textbox" id="question-7" />
				</div>

				<div>
					Question 8: 
					<input className="enter-question" type="textbox" id="question-8" />
				</div>

				<div>
					Question 9: 
					<input className="enter-question" type="textbox" id="question-9" />
				</div>

				<div>
					Question 10: 
					<input className="enter-question" type="textbox" id="question-10" />
				</div>

				<div>
					<button id="submit-new-epa" type="submit" onClick={this.handleClick}>Add</button>
				</div>
			</div>
		);
	}
});

module.exports = AddEPA;