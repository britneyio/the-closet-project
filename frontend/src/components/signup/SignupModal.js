import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useDispatch} from "react-redux";
import {
    Button,
    Modal,
    Form,
    FormControl
} from "react-bootstrap";
import { signupUser } from '../../middleware/SignupActions';
import {StyledModal} from "../../common/inputs";

export default function SignupModal(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const dispatch = useDispatch();

    const onSignupClick = () => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password)
        formData.append('username', username)
        dispatch(signupUser(formData));
    }

        return (
            <StyledModal
                show={props.isOpenUp}
                onHide={props.closeModalUp}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1>Sign up</h1>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={email.length < 1}
                            />
                            <FormControl.Feedback
                                type="invalid">
                                Email required
                            </FormControl.Feedback>
                        </Form.Group>
                        <Form.Group controlId="usernameId">
                            <Form.Label>Username </Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                isInvalid={username.length < 1}
                            />

                            <FormControl.Feedback type="invalid">
                                Username required
                            </FormControl.Feedback>
                        </Form.Group>

                        <Form.Group controlId="passwordId">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={password.length < 8}
                            />

                            <FormControl.Feedback type="invalid">
                                Password of 8 characters required
                            </FormControl.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onSignupClick}>Sign up</Button>
                    <p className="mt-2">Already have account? <Link onClick={props.openSignin}>Sign in</Link></p>
                </Modal.Footer>
            </StyledModal>
        );

}