import React, { Component , useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import  withRouter from '../../withRouter';
import { Button, Form, Modal } from 'react-bootstrap';
import { addType } from './TypeActions';

function AddClothingType(props) {
    const [name, setName] = useState('');
    const onAddClick = () => {
        const formData = new FormData();
        formData.append('name', name);
            props.addType(formData);
        };

        return (
                            <Modal
            show={props.isOpenTypeAdd}
            onHide={props.closeModalTypeAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <h2>Add new type</h2>

                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                <Form>
                    <Form.Group controlId="nameId">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="type_name"
                            placeholder="dress pants"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                    </Form.Group>          
                </Form>
                <Button  color="primary"
                    onClick={() => onAddClick()}>Create</Button>
                </Modal.Body>
                </Modal>
        );
    
    }

AddClothingType.propTypes = {
    addType: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {addType})(withRouter(AddClothingType));
