import React, {Component} from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Modal,
    Form,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signin } from "./SigninActions";

class SigninModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }
    // sets the state to the target name and value
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSigninClick = () => {
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        this.props.signin(userData, "/closet");
    }
    render() {
        return (
            <Modal
            show={this.props.isOpenIn}
            onHide={this.props.closeModalIn}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <h1>Signin</h1>
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
                            value={this.state.email}
                            onChange={this.onChange}
                            />
                            </Form.Group>

                        <Form.Group controlId="passwordId">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={this.onChange}
                            />
                            </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button color="primary"
                    onClick={this.onSigninClick}>Sign in</Button>
                    <p className="mt-2">Don't have an account? <Link to="/signup">Signin</Link></p>
                    </Modal.Footer>
           </Modal>
        );
    }
}

SigninModal.propTypes = {
    signin: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps, {signin}) (SigninModal);