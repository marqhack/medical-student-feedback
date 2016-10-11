var React = require('react');
var ReactDOM = require('react-dom');
var RotationSelector = require('./components/RotationSelector');
var ActivitySelector = require('./components/ActivitySelector');
var ObserverSelector = require('./components/ObserverSelector');
var Button = require('react-bootstrap/lib/Button');
var NavPanel = require('./components/NavPanel');




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

ReactDOM.render(
	<Button bsStyle="success" type="submit">Continue</Button>, document.getElementById("submit")
);





