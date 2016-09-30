var React = require('react');
var ReactDOM = require('react-dom');

var AddEPA = React.createClass({
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
					<button id="submit-new-epa" type="submit">Add</button>
				</div>
			</div>
		);
	}
});

module.exports = AddEPA;