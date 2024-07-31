import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {Button, Form, Modal, Dropdown, Card} from 'react-bootstrap';
import {updateItem, deleteItem, getClothing} from '../../middleware/ClothingActions';
import TypesDropdown from '../types/TypesDropdown';
import withRouter from '../../withRouter';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import colors from '../../common/colors';
import {StyledModal} from "../../common/inputs";
import {getTypes} from "../../middleware/TypeActions";

const ButtonGroup = styled.div`
    display:flex;
    justify-content:space-between;
`;



export default function UpdateModal(props) {
    const item = props.item;
    const [cname, setName] = useState(item.name);
    const [date, setWorn] = useState(item.worn);
    const [type, setCtype] = useState(item.ctype);
    const [loc, setLocation] = useState(item.location);
    const [cov, setCover] = useState(item.cover_file);
    const dispatch = useDispatch();

    const handleCover =  (e) => {
        setCover(e.target.files[0]);
    }

     async function createFile(input) {
         let response = await fetch(input);
         let data = await response.blob();
         let metadata = {
             type: 'image/jpg'
         };
         return new File([data], input, metadata);
     }

    const onDeleteClick = () => {

        const { item } = props;
        dispatch(deleteItem(item.id));
    };
   const onUpdateClick = async ()  => {
            const formData = new FormData();
            const cover = cov instanceof File ? cov : await createFile(item.cover_file);
            formData.append('cover_file', cover);
            formData.append('cover_url', cov);
            formData.append('name', cname);
            formData.append('location',loc);
            formData.append('worn', date);
            formData.append('ctype',type);
            dispatch(updateItem(item.id,formData));
        
        };

        return (
            <StyledModal
show={props.isOpenUpdate}
onHide={props.closeModalUpdate}>
<Modal.Header closeButton>
    <Modal.Title>
    <h2>Update item</h2>

    </Modal.Title>
    </Modal.Header>
    <Modal.Body>
<Form >
    <Form.Group controlId="nameId">
        <Form.Label>Name:</Form.Label>
        <Form.Control
            type="text"
            name="clothingname"
            placeholder={item.name}
            value={cname}
            onChange={e => setName(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="wornId">
        <Form.Label>Last worn:</Form.Label>
        <Form.Control
            type="date"
            name="lastworn"
            value={item.worn}

            onChange={e => setWorn(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="locationId">
        <Form.Label>Location:</Form.Label>
        <Form.Control
            type="text"
            name="location"
            placeholder={item.location}
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
        <Card.Img id={"itemDesign-img"} variant="top" src={item.cover_file} alt={item.name} />

        <Form.Control
            type="file"
            name="cover"
            onChange={handleCover}
            accept="image/*"
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
    

