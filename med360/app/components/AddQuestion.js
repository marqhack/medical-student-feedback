var React = require('react');
var ReactDOM = require('react-dom');

var AddQuestion = React.createClass({

	render: function() {
		return(
			<div>
				Question: <input className="enter-question" type="textbox" />
			</div>
		);
	}
});

module.exports = AddQuestion;