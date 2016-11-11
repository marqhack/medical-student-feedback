var React = require('react');
var ReactDOM = require('react-dom');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var Checkbox = require('react-bootstrap/lib/Checkbox');

var $ = require('jquery');


var ObserverSelector = React.createClass({
	getInitialState: function() {	
		return {
			intern: false,
			resident: false,
			professional: false,
			patient: false,
			self: "on"
		}
	},

	onInternChange: function(e) {
		this.props.handleChange.bind(this.props.index, "intern", e.target.value);
		console.log(e.target.value);
	},
	onResidentChange: function(e) {
		this.setState({ resident: e.target.value });
	},
	onProfessionalChange: function(e) {
		this.setState({ professional: e.target.value });
	},
	onPatientChange: function(e) {
		this.setState({ patient: e.target.value });	
	},

	render: function() {
		var observerSelectorStyle = {
			display: "inline-block",
			verticalAlign: "middle"
		};

		return (
			<FormGroup style={ observerSelectorStyle }>
				<Checkbox className="intern-selector" inline onChange={this.onInternChange}></Checkbox>
				<Checkbox className="resident-selector" inline onChange={this.onResidentChange}></Checkbox>
				<Checkbox className="prof-selector" inline onChange={this.onProfessionalChange}></Checkbox>
				<Checkbox className="patient-selector" inline onChange={this.onPatientChange}></Checkbox>
			</FormGroup>
		);
	}
});

module.exports = ObserverSelector;
