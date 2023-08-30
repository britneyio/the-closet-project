import React, {useState} from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Modal,
    Form,
} from "react-bootstrap";
import {useDispatch} from "react-redux";
import { signin } from "../../middleware/SigninActions";
import {StyledModal} from "../../common/inputs";

const selectAuth = state => state.auth;

export default function SigninModal(props){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();

    const onSigninClick = () => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password)
        dispatch(signin(formData, "/closet"));
    }
        return (
            <StyledModal
            show={props.isOpenIn}
            onHide={props.closeModalIn}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <h1>Sign In</h1>
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
                            />
                            </Form.Group>

                        <Form.Group controlId="passwordId">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />
                            </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button color="primary" type={"submit"}
                    onClick={onSigninClick}>Sign in</Button>
                    <p className="mt-2">Don't have an account? <Link onClick={props.openSignup}>Sign up</Link></p>
                    </Modal.Footer>
           </StyledModal>
        );

}





