// import React, { Component , useState} from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
// import { Button, Form, Modal } from 'react-bootstrap';
// import { addType } from './TypeActions';
// class AddClothingType extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: "",
//         };
//     }

//     onChange = e => {
//         this.setState({ [e.target.name]: e.target.value});
//     };

//     onAddClick = () => {
//         const type = {
//             name: this.state.name
//             };
//             this.props.addType(type);
//         };


//     render() {
//         return (
//             <div>
//                             <Modal
//             show={this.props.isOpenTypeAdd}
//             onHide={this.props.closeModalTypeAdd}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>
//                     <h2>Add new type</h2>

//                     </Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                 <Form>
//                     <Form.Group controlId="nameId">
//                         <Form.Label>Name:</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="type_name"
//                             placeholder="dress pants"
//                             value={this.state.name}
//                             onChange={this.onChange}
//                             />
//                     </Form.Group>          
//                 </Form>
//                 </Modal.Body>
//                 </Modal>
//             </div>
//         );
//     }
//     }

// AddClothingType.propTypes = {
//     addType: PropTypes.func.isRequired
// };

// const mapStateToProps = state => ({});

// export default connect(mapStateToProps, {addType})(AddClothingType);
