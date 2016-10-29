var React = require('react');
var ReactDOM = require('react-dom');
var ObserverSelector = require('./ObserverSelector.js');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Checkbox = require('react-bootstrap/lib/Checkbox');
var $ = require('jquery');


var ActivityRow = React.createClass({
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
		this.props.handleChange(this.props.index, "intern", e.target.value);
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
		var activityRowStyle = {

		};

		return (
			<Row>
				<Col xs={5} md={5} lg={1}> {this.props.activity} </Col>
				<Col xs={5} md={5} lg={1}> <Checkbox onChange={this.onInternChange}></Checkbox> </Col>
				<Col xs={5} md={5} lg={1}> <Checkbox onChange={this.onResidentChange}></Checkbox>  </Col>
				<Col xs={5} md={5} lg={1}> <Checkbox onChange={this.onProfessionalChange}></Checkbox> </Col>
				<Col xs={5} md={5} lg={1}> <Checkbox onChange={this.onPatientChange}></Checkbox> </Col>
			</Row>
		);
	}
});

module.exports = ActivityRow;
