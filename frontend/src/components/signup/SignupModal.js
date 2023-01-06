import React, {Component} from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
    Button,
    Modal,
    Form,
    FormControl
} from "react-bootstrap";
import withRouter from "../../withRouter";
import { signupUser } from './SignupActions';

class SignupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: ""
        };
    }
    // sets the state to the target name and value
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSignupClick = () => {
        const userData = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        };
        this.props.signupUser(userData);
    }
    render() {
        return (
            <Modal
            show={this.props.isOpenUp}
            onHide={this.props.closeModalUp}>
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
                            isInvalid={this.props.createUser.emailError}
                            />
                            <FormControl.Feedback type="invalid">{this.props.createUser.emailError}</FormControl.Feedback>
                            </Form.Group>
                        <Form.Group controlId="usernameId">
                            <Form.Label>Username </Form.Label>
                            <Form.Control 
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={this.state.username}
                            onChange={this.onChange}
                            isInvalid={this.props.createUser.usernameError}
                            />

                            <FormControl.Feedback type="invalid">
                            {this.props.createUser.usernameError}
                                </FormControl.Feedback>
                        </Form.Group>

                        <Form.Group controlId="passwordId">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={this.password}
                            onChange={this.onChange}
                            isInvalid={this.props.createUser.passwordError}
                            />
                            <FormControl.Feedback type="invalid">
                           {this.props.createUser.passwordError}
                            </FormControl.Feedback>
                            </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button color="primary"
                    onClick={this.onSignupClick}>Sign up</Button>
                    <p className="mt-2">Already have account? <Link to="/signin">Signin</Link></p>
                    </Modal.Footer>
           </Modal>
        );
    }
}

SignupModal.propTypes = {
    signupUser: PropTypes.func.isRequired,
    createUser: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    createUser: state.createUser
});


export default connect(mapStateToProps, {signupUser})(withRouter(SignupModal));