var React = require('react');
var ReactDOM = require('react-dom');

var ActivityTable = require('./components/ActivityTable');
var SendSurvey = require('./components/SendSurvey');

var SurveyConfig = require('./components/SurveyConfig');
var SurveyPage = require('./components/SurveyPage');
var Button = require('react-bootstrap/lib/Button');
var NavPanel = require('./components/NavPanel');

ReactDOM.render(
	<NavPanel />, document.getElementById("nav")
);

ReactDOM.render(<SurveyConfig />, document.getElementById("activities"));

ReactDOM.render(<SendSurvey />, document.getElementById("observers"));

ReactDOM.render(<SurveyPage />, document.getElementById('survey-container'));

// ReactDOM.render(
//   <ActivitySelector />, 
//   document.getElementById("activities")
// );

// ReactDOM.render(
//   <RotationSelector />,
//   document.getElementById("rotations")
// );



// ReactDOM.render(
// 	<Button bsStyle="success" type="submit">Continue </Button>, document.getElementById("submit")
// );







