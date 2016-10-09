var React = require('react');
var ReactDOM = require('react-dom');

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Form = require('react-bootstrap/lib/Form');
var Collapse = require('react-bootstrap/lib/Collapse');
var Button = require('react-bootstrap/lib/Button');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var ProfEmailForm = require('./ProfEmailForm');

const ObserverSelector = React.createClass({
	
	render: function(){

		return(
			<div>
			<ControlLabel>Select observer</ControlLabel>
			<br/>
				<ButtonGroup vertical block>
		 		<Button>Patient</Button>
	     		<Button>Self</Button>      			
       			<Button>Professional<ProfEmailForm /></Button>
       			</ButtonGroup>
			</div>
		)
	}

});

module.exports = ObserverSelector;