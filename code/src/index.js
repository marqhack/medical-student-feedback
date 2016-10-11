var React = require('react');
var ReactDOM = require('react-dom');
var RotationSelector = require('./components/RotationSelector');
var ActivitySelector = require('./components/ActivitySelector');
var ObserverSelector = require('./components/ObserverSelector');
var Survey = require('./components/Survey');
var Button = require('react-bootstrap/lib/Button');
var NavPanel = require('./components/NavPanel');
var $ = require('jquery');





ReactDOM.render(
	<NavPanel />, document.getElementById("nav")
);

ReactDOM.render(
  <ActivitySelector />, 
  document.getElementById("activities")
);

ReactDOM.render(
  <RotationSelector />,
  document.getElementById("rotations")
);

ReactDOM.render(
  <ObserverSelector />,
  document.getElementById("observers")
);

ReactDOM.render(<Survey />, document.getElementById('survey-container'));

ReactDOM.render(
	<Button bsStyle="success" type="submit">Continue </Button>, document.getElementById("submit")
);





