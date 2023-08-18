import React, {useState} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import {StyledModal} from "../../common/inputs";
import {useDispatch} from "react-redux";
import {updateUserEmail, updateUsername, updateUserPassword} from "../../middleware/UserActions";
import styled from "styled-components";

const DeleteButton = styled.button`
  background-color: white !important;
  color:grey !important;
  :hover {
    color:black !important;
  }
`;
export default function UserSettings(props) {
    const user = props.user;
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(user['email']);
    const [previousPass, setPreviousPass] = useState("");
    const dispatch = useDispatch();
    // console.log(user)
    const onDeleteClick = () => {
        // dispatch(deleteUser(user.id));
    };

   const updateName = ()  =>  dispatch(updateUsername(username));
   const updateEmail = () => dispatch(updateUserEmail(email, previousPass));
   const updatePassword = () => dispatch(updateUserPassword(previousPass, password));

        return (
            <StyledModal
show={props.isOpenUpdate}
onHide={props.closeModalUpdate}>
<Modal.Header closeButton>
    <Modal.Title>
    <h2>User Settings</h2>

    </Modal.Title>
    </Modal.Header>
    <Modal.Body>
<Form >
    <Form.Group controlId="usernameId">
        <Form.Label>Username:</Form.Label>
        <Form.Control
            type="text"
            name="username"
            placeholder={user.username}
            value={username}
            onChange={e => setUsername(e.target.value)}
            />
    </Form.Group>
    <br/>
    <Button  color="primary"
    onClick={() => updateName()}>Save</Button>
</Form>
        <hr/>

        <Form >
            <Form.Group controlId="emailId">
                <Form.Label>Update Email </Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    placeholder={email}
                    onChange={e => setEmail(e.target.value)}
                    />
            </Form.Group>
            <Form.Group controlId="passwordId">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={previousPass}
                    onChange={e => setPreviousPass(e.target.value)}

                    />
            </Form.Group>
            <br/>
            <Button  color="primary"
                     onClick={() => updateEmail()}>Update</Button>
        </Form>

        <hr/>
        <Form >
            <Form.Group controlId="oldPasswordId">
                <Form.Label>Update Password: </Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={previousPass}
                    placeholder={"current password"}
                    onChange={e => setPreviousPass(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="newPasswordId">
                <Form.Label>New Password:</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}

                />
            </Form.Group>

            <br/>

            <Button  color="primary"
                     onClick={() => updateEmail()}>Update</Button>
        </Form>

        <hr/>
    <DeleteButton  color="dark"
    onClick={() => onDeleteClick()}>Delete Account</DeleteButton>
</Modal.Body>

<Modal.Footer>

    </Modal.Footer>
</StyledModal>
);
    }






