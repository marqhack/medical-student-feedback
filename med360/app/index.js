var React = require('react');
var ReactDOM = require('react-dom');
var Rotation = require('./components/Rotation');
var ActivitySelector = require('./components/ActivitySelector');
var ObserverSelector = require('./components/ObserverSelector');
var AddEPA = require('./components/AddEPA');

  
ReactDOM.render(
  <ActivitySelector />, 
  document.getElementById("activities")
);

ReactDOM.render(
  <Rotation />,
  document.getElementById("rotations")
);

ReactDOM.render(
  <ObserverSelector />,
  document.getElementById("observers")
);

ReactDOM.render(<AddEPA />, document.getElementById('add-epa'));

document.getElementById('submit-new-epa').click(function() {
	console.log("add has been clicked");
});