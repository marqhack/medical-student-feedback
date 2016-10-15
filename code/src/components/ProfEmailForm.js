var React = require('react');
var ReactDOM = require('react-dom');

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Form = require('react-bootstrap/lib/Form');
var Button = require('react-bootstrap/lib/Button');
var Collapse = require('react-bootstrap/lib/Collapse');
var Well = require('react-bootstrap/lib/Well');
var Col = require('react-bootstrap/lib/Col');

class ProfEmailForm extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Button bsStyle="warning" onClick={ ()=> this.setState({ open: !this.state.open })}>
             enter email
        </Button>
          <Collapse in={this.state.open}>
          <div>
            <Well>
              <Form horizontal>
              <FormGroup controlId="emailEvaluation">
              	<Col componentClass={ControlLabel}>Name</Col>
              	<Col>
                <FormControl type="text" placeholder="Name" />
              	</Col>
               	<Col componentClass={ControlLabel}>Email</Col>
              	<Col>
                <FormControl type="email" placeholder="Email" />
           	    </Col>
              </FormGroup>
           	  </Form>
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}

module.exports = ProfEmailForm;