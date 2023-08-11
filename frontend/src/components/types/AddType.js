import React, {useState} from 'react';
import { useDispatch} from 'react-redux';
import  withRouter from '../../withRouter';
import { Button, Form, Modal } from 'react-bootstrap';
import { addType } from '../../middleware/TypeActions';

function AddClothingType(props) {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const onAddClick = () => {
        const formData = new FormData();
        formData.append('name', name);
        dispatch(addType(formData));
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



export default (withRouter(AddClothingType));

