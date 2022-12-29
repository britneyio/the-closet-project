import React, {Component} from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Modal,
    Form,
    FormControl
} from "react-bootstrap";

class SigninModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            email: ""
        };
    }
    // sets the state to the target name and value
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSigninClick = () => {
        const userData = {
            password: this.state.password,
            email: this.state.email
        };
        console.log("Sign up "  + userData.password + " " + userData.email)
    }
    render() {
        return (
            <Modal
            show={this.props.isOpenIn}
            onHide={this.props.closeModalIn}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <h1>Signup</h1>
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                    <Form.Group controlId="emailId">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={this.email}
                            onChange={this.onChange}
                            />
                            <FormControl.Feedback type="invalid"></FormControl.Feedback>
                            </Form.Group>

                        <Form.Group controlId="passwordId">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={this.password}
                            onChange={this.onChange}
                            />
                            <FormControl.Feedback type="invalid"></FormControl.Feedback>
                            </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button color="primtary"
                    onClick={this.onSignupClick}>Sign up</Button>
                    <p className="mt-2">Don't have an account? <Link to="/signup">Signin</Link></p>
                    </Modal.Footer>
           </Modal>
        );
    }
}

export default SigninModal;