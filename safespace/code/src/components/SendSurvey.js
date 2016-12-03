var React = require('react');
var ReactDOM = require('react-dom');

var ObserverInfo = require('./ObserverInfo');

var Button = require('react-bootstrap/lib/Button');
var $ = require('jquery');


var SendSurvey = React.createClass({
	getInitialState: function() {	
		return {
			people: ["intern", "resident", "faculty", "patient"]
		}
	},
	
	render: function() {
		var sendSurveyStyle = {

		};

		return (
			<div>
				{
	 				this.state.people.map(function(person) {
	 					return(<ObserverInfo role={person} />)
	 				})
	 			}
	 			<br />
	 			<Button type="submit" bsSize="xsmall" bsStyle="success" >Continue</Button>
 			</div>
		);
	}
});

module.exports = SendSurvey;
