var React = require('react');
var ReactDOM = require('react-dom');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var Checkbox = require('react-bootstrap/lib/Checkbox');

var $ = require('jquery');


var ObserverSelector = React.createClass({
	getInitialState: function() {	
		return {
			nothing: ""
		}
	},
	render: function() {
		var observerSelectorStyle = {
			display: "inline-block",
			verticalAlign: "middle"
		};

		return (
			<FormGroup style={ observerSelectorStyle }>
				<Checkbox className="intern-selector" inline></Checkbox>
				<Checkbox className="resident-selector" inline></Checkbox>
				<Checkbox className="prof-selector" inline></Checkbox>
				<Checkbox className="patient-selector" inline></Checkbox>
			</FormGroup>
		);
	}
});

module.exports = ObserverSelector;
