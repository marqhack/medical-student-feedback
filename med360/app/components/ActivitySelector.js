var React = require('react');
var ReactDOM = require('react-dom');


var ActivitySelector = React.createClass({
	 
	 initialState: function(){
	 	return (
	 		checked: false
	 	);
	 },

	 handleChange: function(e){
	 	this.setState(e.target.value);
	 },

	render: function(){
		return(
			<div className="activity">
				<h3>Select all activities observed</h3>
				<label>
					<input type="checkbox" value="activity1" onChange={this.handleChange} />
					History
				</label>
				<br />
				<label>
					<input type="checkbox" value="activity2" onChange={this.handleChange} />
					Physical Exam
				</label>
				<br />
				<label>
					<input type="checkbox" value="activity3" onChange={this.handleChange} />
					Informed Consent
				</label>
				<br />
				<label>
					<input type="checkbox" value="activity4" onChange={this.handleChange} />
					Patient Handoff
				</label>
			</div>
		);
	}
});


module.exports = ActivitySelector;
