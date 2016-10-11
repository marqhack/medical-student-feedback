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
var $ = require('jQuery');
var update = require('react-addons-update');


var ObserverSelector = React.createClass({
	
	getInitialState: function(){
		return {
			profs: [],
			name: '',
			email: ''
		}
	},

	handleNameChange: function(e){
		this.setState({name: e.target.value});
	},

	handleEmailChange: function(e){
		this.setState({email: e.target.value});
	},

	handleSubmit: function(e){
		e.preventDefault();
		var newProf = {
			id: this.state.profs.length + 1,
			name: this.state.name,
			email: this.state.email
		};
		this.setState((prevState) => ({
			profs: prevState.profs.concat(newProf),
			name: '',
			email: ''
		}));
	},

	handleRemove: function(prof){
		const modifiedProfs = this.state.profs;
		if(modifiedProfs.indexOf(prof) > -1){
			modifiedProfs.splice(modifiedProfs.indexOf(prof), 1);
			this.setState({profs: modifiedProfs})
		}
	},

	render: function(){
		return(
			<div className="profSelector">
				<ControlLabel>Professionals</ControlLabel>
				<ProfList profs={this.state.profs} onRemove={this.handleRemove} />
				<form onSubmit={this.handleSubmit}>
					<input id="name" placeholder="Name" onChange={this.handleNameChange} value={this.state.name} />
					<input id="email" placeholder="Email" onChange={this.handleEmailChange} value={this.state.email} />
					<button>{'Add Professional ' + (this.state.profs.length +1)}</button>
				</form>
			</div>
		);
	}
});

//view the professionals already added
var ProfList = React.createClass({
	render: function(){

		return(
		<div>
			<div id="profs">
			{this.props.profs.map(prof => (
				<div key={prof.id}>{(prof.id) + ") " + (prof.name) + ": " + (prof.email) + " "}
					<input type="button" onClick={this.props.onRemove.bind(this, prof)} value="Remove" />
				</div>
				))}
			</div>
		</div>
		);

		return (
			<div>
			{prof}
			</div>
		)
	}
});



module.exports = ObserverSelector;