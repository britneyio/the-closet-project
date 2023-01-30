import React, { Component , useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Modal, Dropdown } from 'react-bootstrap';
import { updateItem } from './ClothingActions';
import { getTypes } from '../types/TypeActions';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import TypesDropdown from '../types/TypesDropdown';

function UpdateModal(props) {
    const [cname, setName] = useState('');
    const [date, setWorn] = useState('');
    const [type, setCtype] = useState('');
    const [loc, setLocation] = useState('');
    const [cov, setCover] = useState(null); 


    const handleCover = (e) => {
        setCover(e.target.files[0]);
    }
   const onUpdateClick = ()  => {
            const formData = new FormData();
            formData.append('cover', cov);
            formData.append('name', cname);
            formData.append('location',loc);
            formData.append('worn', date);
            formData.append('ctype',type);
            props.addItem(formData);
        
        };
        return (
            <Modal
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
            placeholder={props.item.name}
            value={cname}
            onChange={e => setName(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="wornId">
        <Form.Label>Last worn:</Form.Label>
        <Form.Control
            type="date"
            name="lastworn"
            value={props.item.worn}

            onChange={e => setWorn(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="locationId">
        <Form.Label>Location:</Form.Label>
        <Form.Control
            type="text"
            name="location"
            placeholder={props.item.location}
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
    onClick={() => onUpdateClick()}>Create</Button>
</Form>
</Modal.Body>

<Modal.Footer>
   
    </Modal.Footer>
</Modal>
);
    }
    

UpdateModal.propTypes = {
    updateItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {updateItem})(UpdateModal);
