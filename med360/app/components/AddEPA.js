var React = require('react');
var ReactDOM = require('react-dom');

var AddEPA = React.createClass({
	handleClick: function(e) {
		var obj = {
			name: document.getElementById('name').value,
			description: document.getElementById('description').value
		}
		console.log(JSON.stringify(obj));
	},

	render: function() {
		return(
			<div>
				<h3>Add a new EPA</h3>
				<div>
					<label htmlFor="name">Name</label><br />
					<input type="textbox" id="name"/>
				</div>

				<div>
					<label htmlFor="description">Description</label><br />
					<textarea id="description" />
				</div>

				<div>
					<button id="submit-new-epa" type="submit" onClick={this.handleClick}>Add</button>
				</div>
			</div>
		);
	}
});

module.exports = AddEPA;