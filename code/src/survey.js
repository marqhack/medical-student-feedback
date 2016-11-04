var React = require('react');
var ReactDOM = require('react-dom');
var NavPanel = require('./components/NavPanel');

ReactDOM.render(
	<NavPanel />, document.getElementById("nav")
);

ReactDOM.render(
	<Survey />, document.getElementById("survey-container")
);