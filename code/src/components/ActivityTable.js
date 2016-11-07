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
		return {};
	},

	addRow: function(activityRow){
		this.state.activities << activityRow;
		this.setState({activities: this.state.activities});
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
