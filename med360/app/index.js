var React = require('react');
var ReactDOM = require('react-dom');
var Rotation = require('./components/Rotation');
var ActivitySelector = require('./components/ActivitySelector');
var ObserverSelector = require('./components/ObserverSelector');

  
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