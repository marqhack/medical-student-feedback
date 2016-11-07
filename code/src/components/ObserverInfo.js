var React = require('react');
var ReactDOM = require('react-dom');

var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Checkbox = require('react-bootstrap/lib/Checkbox');
var $ = require('jquery');


var ObserverInfo = React.createClass({
	getInitialState: function() {	
		return {
			
		}
	},
	
	render: function() {
		var observerInfoStyle = {

		};

		return (
			<div>
				<label> {this.props.role} email: </label> <br />
				<input type="email" placeholder={this.props.role + ".email@xyz.com"} /> <br />
				<label> {this.props.role} name: </label> <br />
				<input type="text" placeholder={this.props.role + " First and Last Name"} /> <br />
				<Checkbox>Yes, I will be providing feedback on this device</Checkbox>
				<br />
 			</div>
		);
	}
});

module.exports = ObserverInfo;
