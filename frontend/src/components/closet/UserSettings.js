// import React, {useState} from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Button, Form, Modal } from 'react-bootstrap';
// import withRouter from '../../withRouter';
// function UserSettings(props) {
//     const {user} = props.auth;
//     const [username, setUsername] = useState(user.username);
//     const [password, setPassword] = useState(user.password);
//     const [email, setEmail] = useState(user.email);
//
//     const onDeleteClick = () => {
//         props.deleteUser(user.id);
//     };
//
//    const onUpdateClick = ()  => {
//             const formData = new FormData();
//             formData.append(username, 'username');
//             formData.append(password, 'password');
//             formData.append(email, 'email');
//
//             props.updateUser(user.id,formData);
//
//         };
//
//         return (
//             <Modal
// show={props.isOpenUpdate}
// onHide={props.closeModalUpdate}>
// <Modal.Header closeButton>
//     <Modal.Title>
//     <h2>Update item</h2>
//
//     </Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
// <Form >
//     <Form.Group controlId="usernameId">
//         <Form.Label>Name:</Form.Label>
//         <Form.Control
//             type="text"
//             name="username"
//             placeholder={user.username}
//             value={user.username}
//             onChange={e => setUsername(e.target.value)}
//             />
//     </Form.Group>
//     <Form.Group controlId="emailId">
//         <Form.Label>Last worn:</Form.Label>
//         <Form.Control
//             type="email"
//             name="email"
//             value={user.email}
//             placeholder={user.email}
//             onChange={e => setEmail(e.target.value)}
//             />
//     </Form.Group>
//     <Form.Group controlId="passwordId">
//         <Form.Label>Location:</Form.Label>
//         <Form.Control
//             type="password"
//             name="password"
//             placeholder={user.password}
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             />
//     </Form.Group>
//
//     <Button  color="primary"
//     onClick={() => onUpdateClick()}>Update</Button>
//     <Button  color="dark"
//     onClick={() => onDeleteClick()}>Delete</Button>
// </Form>
// </Modal.Body>
//
// <Modal.Footer>
//
//     </Modal.Footer>
// </Modal>
// );
//     }
//
//
// UserSettings.propTypes = {
//     updateUser: PropTypes.func.isRequired,
//     deleteUser: PropTypes.func.isRequired
// };
//
// const mapStateToProps = state => ({});
//
// export default connect(mapStateToProps, {updateUser, deleteUser})(withRouter(UserSettings));
