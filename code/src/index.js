var React = require('react');
var ReactDOM = require('react-dom');

<<<<<<< HEAD
var ActivityTable = require('./components/ActivityTable');
var SendSurvey = require('./components/SendSurvey');

=======
var SurveyConfig = require('./components/SurveyConfig');
var SurveyPage = require('./components/SurveyPage');
>>>>>>> c0bb7b70ca1f5000a211da77b97633e6046c76db
var Button = require('react-bootstrap/lib/Button');
var NavPanel = require('./components/NavPanel');

ReactDOM.render(
	<NavPanel />, document.getElementById("nav")
);

ReactDOM.render(<SurveyConfig />, document.getElementById("activities"));

ReactDOM.render(<SurveyPage />, document.getElementById('survey-container'));

ReactDOM.render(<SendSurvey />, document.getElementById("observers"));

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







