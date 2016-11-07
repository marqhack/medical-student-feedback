var React = require('react');
var ReactDOM = require('react-dom');
var Tabs = require('react-bootstrap/lib/Tabs');
var Tab = require('react-bootstrap/lib/Tab');
var Survey = require('./Survey');



var SurveyPanel = React.createClass({
	getInitialState: function(){
		return {

		};
	},
	
	handleSubmit: function(){
		alert("submit successful");
	},

	render: function(){
		return (
			<Tabs defaultActiveKey={1} id="survey-panel">
			
				{
	               	this.props.observers.map(function(observer, index) { 
	                    return (<Tab key={'observer-'+index} eventKey={ index } title={ observer } disabled = {false}
	                    		onSubmit = {this.handleSubmit}
	                    		> 
	                    		<Survey observer = {observer}/>
	      	
	                    	</Tab>); 
	                })
	            }
	        </Tabs>

		);
	}

});

module.exports = SurveyPanel;
