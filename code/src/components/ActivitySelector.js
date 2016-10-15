var React = require('react');
var ReactDOM = require('react-dom');

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Form = require('react-bootstrap/lib/Form');


const ActivitySelector = React.createClass({
	render: function(){
		return(

			<form>
				<FormGroup controlId="activitySelector">
	     		<ControlLabel>Select all activities</ControlLabel>
	     		<FormControl componentClass="select" multiple>
	        		<option value="select">Select all...</option>
	        		<option value="epa1">Gather patient history</option>
	        		<option value="epa2">Give a physical exam</option>
	      			<option value="epa6">Provide oral presentation of clinical encounter</option>
	      			<option value="epa8">Patient handoff</option>
	      			<option value="epa11">Obtain informed consent</option>
	      		</FormControl>
				</FormGroup>
			</form>
		)
	}
});


module.exports = ActivitySelector;