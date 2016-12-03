var React = require('react');
var ReactDOM = require('react-dom');
var AddEPA = require('./components/AddEPA');
var NavPanel = require('./components/NavPanel');


ReactDOM.render(
	<NavPanel />, document.getElementById("nav")
);


ReactDOM.render(
	<AddEPA />, document.getElementById("add-epa")
);
