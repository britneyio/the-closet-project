import React, {  useState} from 'react';
import { useDispatch} from 'react-redux';

import { Button, Form, FormSelect, Modal } from 'react-bootstrap';
import { addItem } from '../../middleware/ClothingActions';
import TypesDropdown from '../types/TypesDropdown';
import {StyledModal} from "../../common/inputs";

export default function AddClothingItem(props) {
    const [cname, setName] = useState('');
    const [date, setWorn] = useState('');
    const [type, setCtype] = useState('');
    const [loc, setLocation] = useState('');
    const [cov, setCover] = useState(null); 
    const dispatch = useDispatch();

    
    const handleCover = (e) => {
        setCover(e.target.files[0]);
    }
   const onAddClick = ()  => {
            const formData = new FormData();
            formData.append('cover', cov);
            formData.append('name', cname);
            formData.append('location',loc);
            formData.append('worn', date);
            formData.append('ctype',type);
            dispatch(addItem(formData));
        
        };


        return (
                            <StyledModal
            show={props.isOpenAdd}
            onHide={props.closeModalAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <h2>Add new item</h2>

                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                <Form >
                    <Form.Group controlId="nameId">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="clothingname"
                            placeholder="favorite blue jeans"
                            value={cname}
                            onChange={e => setName(e.target.value)}
                            />
                    </Form.Group>
                    <Form.Group controlId="wornId">
                        <Form.Label>Last worn:</Form.Label>
                        <Form.Control
                            type="date"
                            name="lastworn"
                            value={date}

                            onChange={e => setWorn(e.target.value)}
                            />
                    </Form.Group>
                    <Form.Group controlId="locationId">
                        <Form.Label>Location:</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="top left drawer"
                            value={loc}
                            onChange={e => setLocation(e.target.value)}
                            />
                    </Form.Group>
                    <Form.Group controlId="ctypeId">
                        <Form.Label>Clothing type:</Form.Label>
                        <TypesDropdown value={type} 
                        onChange={e => setCtype(e.target.value)}
                        types={props.types}
                        />
                    </Form.Group>
                    <Form.Group controlId="coverId">
                        <Form.Label>Last worn:</Form.Label>
                        <Form.Control
                            type="file"
                            name="cover"
                            onChange={handleCover}
                            accept="image/*"
                            />
                    </Form.Group>
                    <Button  color="primary"
                    onClick={() => onAddClick()}>Create</Button>
                </Form>
                </Modal.Body>

                <Modal.Footer>
                   
                    </Modal.Footer>
                </StyledModal>
        );
    }
    



