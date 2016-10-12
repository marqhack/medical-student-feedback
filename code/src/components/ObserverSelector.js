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
				<form inline onSubmit={this.handleSubmit}>
				<Form inline>
				<FormGroup controlId="addProf">
					<ControlLabel>Name</ControlLabel>
					{' '}
					<FormControl id="name" type="text" placeholder="Name" onChange={this.handleNameChange} value={this.state.name}/>
					{' '}
					<ControlLabel>Email</ControlLabel>
					{' '}
					<FormControl id="email" type="email" placeholder="Email" onChange={this.handleEmailChange} value={this.state.email}/>
					{' '}
				</FormGroup>
				{' '}
				<Button size="small" type="submit" bsStyle="warning">{'Add Professional ' + (this.state.profs.length +1)}</Button>
				</Form>
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
					<Button type="submit" bsSize="xsmall" bsStyle="danger" onClick={this.props.onRemove.bind(this, prof)}>
					Remove  
					</Button>
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