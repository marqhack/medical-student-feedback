var React = require('react');
var ReactDOM = require('react-dom');
var ActivityRow = require('./ActivityRow.js');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Button = require('react-bootstrap/lib/Button');

var $ = require('jquery');


var ActivityTable = React.createClass({
	getInitialState: function() {	
		return {
			activities: [{
					activityName: "activity 1", 
					intern: "off",
					resident: "off",
					professional: "off",
					patient: "off",
					self: "on"
				}, {
					activityName: "activity 2", 
					intern: "off",
					resident: "off",
					professional: "off",
					patient: "off",
					self: "on"
				}, {
					activityName: "activity 3", 
					intern: "off",
					resident: "off",
					professional: "off",
					patient: "off",
					self: "on"
				}, {
					activityName: "activity 4", 
					intern: "off",
					resident: "off",
					professional: "off",
					patient: "off",	
					self: "on"
				}, 	{
					activityName: "activity 5", 
					intern: "off",
					resident: "off",
					professional: "off",
					patient: "off",
					self: "on"
				}]

		};
	},

	render: function() {

		return (
			<div>
				<Grid>
					<Row>
						<Col xs={5} md={5} lg={1}> Activity </Col>
						<Col xs={5} md={5} lg={1}> Intern </Col>
						<Col xs={5} md={5} lg={1}> Resident  </Col>
						<Col xs={5} md={5} lg={1}> Professional </Col>
						<Col xs={5} md={5} lg={1}> Patient </Col>
					</Row>

					{
						this.state.activities.map(function(activity, index) { 
							return (<ActivityRow key={ 'activity-' + index } index={ index } activity={ activity.activityName }  />); 
						})
					}
				</Grid>

				<Button type="submit" bsSize="xsmall" bsStyle="success" >Continue</Button>
			</div>
		);
	}
});

module.exports = ActivityTable;
