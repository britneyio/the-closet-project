import React, { useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Modal, Dropdown } from 'react-bootstrap';
import { updateItem, deleteItem } from './ClothingActions';
import TypesDropdown from '../types/TypesDropdown';
import withRouter from '../../withRouter';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import colors from '../../common/colors';

const StyledModal = styled(Modal)`
& .modal-content {
    background-color: ${colors.background1};
}
justify-content:space-between;
button {
    background-color: ${colors.highlight1};
    margin-left: 20px;
    margin-top: 10px;
}

button:hover {
    background-color: ${colors.highlight3};
}
`;

const ButtonGroup = styled.div`
    display:flex;
    justify-content:space-between;
`;



function UpdateModal(props) {
    const item = props.item;
    const [cname, setName] = useState(item.name);
    const [date, setWorn] = useState(item.worn);
    const [type, setCtype] = useState(item.ctype);
    const [loc, setLocation] = useState(item.location);
    const [cov, setCover] = useState(item.cover); 


    const handleCover = (e) => {
        setCover(e.target.files[0]);
    }

     function createFile(input){
        let response =  fetch(input);
        let data =  response.blob();
        let metadata = {
          type: 'image/jpeg'
        };
        return new File([data], input, metadata);
    }

    const onDeleteClick = () => {
        const { item } = props;
        props.deleteItem(item.id);
    };
   const onUpdateClick = ()  => {
            const formData = new FormData();
            if (cov === item.cover) {
                setCover(createFile(item.cover));
            }
            console.log(cov);
            formData.append('cover', cov);
            formData.append('name', cname);
            formData.append('location',loc);
            formData.append('worn', date);
            formData.append('ctype',type);
            props.updateItem(item.id,formData);
        
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
        <Form.Label>Last worn:</Form.Label>
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
    

UpdateModal.propTypes = {
    updateItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {updateItem, deleteItem})(withRouter(UpdateModal));
