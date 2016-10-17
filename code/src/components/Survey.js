var React = require('react');
var ReactDOM = require('react-dom');

var SurveyEPA = require('./SurveyEPA');
var Button = require('react-bootstrap/lib/Button');
var $ = require('jquery');


var Survey = React.createClass({
    componentDidMount: function() { 
        this.serverRequest = $.get('/api/epalist', function (result) {
            this.setState({
                EPAs: result 
            });
        }.bind(this)); 
    }, 
	getInitialState: function() {
		// an ajax call will replace this 
		return {
			EPAs: [] 
		}
	},
	render: function() {
		var surveyStyle = {
			margin: "20px",
			backgroundColor: "#99badd",
			padding: "20px",
			borderRadius: "4px"
		};

		var submitStyle = {
			width: "200px"
		}; 
		return (
			// for each epa selected, render a SurveyEPA 
			<div style={surveyStyle} id="survey">
				{
                    this.state.EPAs.map(function(EPA, index) { 
                        return (<SurveyEPA key={ 'epa-' + index } EPA={ EPA } />); 
                    })
                }
                <Button style={submitStyle} bsClass="btn-block btn-sucess btn-sm" type="submit">Submit</Button>			
			</div>
		);
	}
});

module.exports = Survey;
