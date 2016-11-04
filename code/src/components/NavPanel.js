var React = require('react');
var ReactDOM = require('react-dom');
var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');

const NavPanel = React.createClass({

	render(){
		return(
			<Nav bsStyle="pills">
			    <NavItem eventKey={1} href="/"  >Home</NavItem>
			    <NavItem eventKey={2} href="/admin" >Admin Panel</NavItem>
  			</Nav>
		);
	}

});


module.exports = NavPanel;

