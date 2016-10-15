var React = require('react');
var ReactDOM = require('react-dom');
var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');

const NavPanel = React.createClass({

	handleSelect(selectedKey) {
  		this.setState({activeKey: selectedKey})
	}, 

	render(){
		return(
			<Nav bsStyle="pills" activeKey="home" onClick={this.handleSelect}>
			    <NavItem eventKey="home" href="/home">Home</NavItem>
			    <NavItem eventKey="login" href="/login">User Login</NavItem>
			    <NavItem eventKey="admin" href="/admin">Admin Panel</NavItem>
  			</Nav>
		);
	}

});


module.exports = NavPanel;

