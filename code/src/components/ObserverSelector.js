var React = require('react');
var ReactDOM = require('react-dom');

var ObserverSelector = React.createClass({
	initialState: function(){
		return (
			observer: ''
		)
	},

	handleChange: function(e){
		this.setState(e.target.value);
	},

	render: function(){
		return (
			<div>
				<h3>Select observer.</h3>
				<label>
				<input type="radio" name="observer" onChange={this.handleChange} />
				Patient
				</label>
				<br />
				<label>
				<input type="radio" name="observer" onChange={this.handleChange} />
				Professional
				</label>
				<br />
				<label>
				<input type="radio" name="observer" onChange={this.handleChange} />
				Student 
				</label>

			</div>
		)
	}

});

module.exports = ObserverSelector;