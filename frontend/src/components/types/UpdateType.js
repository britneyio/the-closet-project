import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Form, Modal} from 'react-bootstrap';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {StyledModal} from "../../common/inputs";
import {deleteType, updateType} from "../../middleware/TypeActions";

const ButtonGroup = styled.div`
    display:flex;
    justify-content:space-between;
`;

export default function UpdateType(props) {
    const type = props.type;
    const [name, setName] = useState(type.name);
    const dispatch = useDispatch();

    const onDeleteClick = () => {

        const { type } = props;
        dispatch(deleteType(type.id));
    };
    const onUpdateClick =  async ()  => {
        const formData = new FormData();
        formData.append('name', name);
        dispatch(updateType(type.id,formData));

    };

    return (
        <StyledModal
            show={props.isOpenUpdate}
            onHide={props.closeModalUpdate}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h2>Update clothing type</h2>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <Form.Group controlId="nameId">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder={type.name}
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>


                    <hr/>
                    <ButtonGroup>
                        <Button  size="sm"
                                 onClick={() => onUpdateClick()}>Update</Button>
                        <DeleteOutlined onClick={() => onDeleteClick()} />
                    </ButtonGroup>
                </Form>
            </Modal.Body>

            <Modal.Footer>

            </Modal.Footer>
        </StyledModal>
    );
}

