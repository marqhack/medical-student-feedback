var React = require('react');
var ReactDOM = require('react-dom');

var Rotation = React.createClass({
	initialState: function(){
		return (
			rotation: ''
		)
	},

	handleChange: function(e){
		this.setState(e.target.value);
	},

	render: function(){
		return(
			<div>
				<h3>Select course/rotation.</h3>
				<form>
					<select name="menu" onChange={this.handleChange}>
					<option>Year 1</option>
					<option>Year 2</option>
					<option>Year 3</option>
					</select>
				</form>
			</div>
		)
	}

});

module.exports = Rotation;
