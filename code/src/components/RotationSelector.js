var React = require('react');
var ReactDOM = require('react-dom');

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Form = require('react-bootstrap/lib/Form');


const RotationSelector = React.createClass({
	
	render: function(){
		return(
			<form>
				<FormGroup controlId="rotationSelector">
	     		<ControlLabel>Select current rotation</ControlLabel>
	     		<FormControl componentClass="select">
	        		<option value="select">Select...</option>
	        		<option value="rotation1">Family Medicine</option>
	        		<option value="rotation2">Pediatrics</option>
	      			<option value="rotation3">Neuroscience</option>
	      			<option value="rotation3">Surgery</option>
	      		</FormControl>
				</FormGroup>
			</form>
		)
	}

});

module.exports = RotationSelector;
