var React = require('react');
var ReactDOM = require('react-dom');
var AddQuestion = require('./AddQuestion');

var AddEPA = React.createClass({
	getInitialState: function() {
		return {questions: [{id: 1}]}
	},

	save: function(e) {
		var obj = {
			name: document.getElementById('name').value,
			description: document.getElementById('description').value,
			questions: []
		}
		questions = document.getElementsByClassName('enter-question');
		for (var i = 0; i < questions.length; i++) {
			obj.questions.push(questions.item(i).value);
		}

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: obj,
            success: function(data) {
            this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
            }.bind(this)
        });


       
		console.log(JSON.stringify(obj));
	},

	addQuestion: function() {
		console.log(this.state);	
		// newQuestion['id'] = this.state.questions.length + 1;
		// console.log(newQuestion.id);
		var newQuestion = {
			id: this.state.questions.length + 1
		}
		console.log(newQuestion.id);

		modifiedQuestions = this.state.questions.slice();
		modifiedQuestions.push(newQuestion);
		this.setState({ questions: modifiedQuestions });
		console.log("after add: "+ JSON.stringify(this.state));
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
				<div id="questions-container">
				{
				    this.state.questions.map((item) => (
                        <AddQuestion key={item.id} />
                    ))
                }
				</div>


				<div>
					<button id="add-new-question" onClick={this.addQuestion}>Add</button>
				</div>

				<div>
					<button id="submit-new-epa" type="submit" onClick={this.save}>Save</button>
				</div>
			</div>
		);
	}
});

module.exports = AddEPA;
