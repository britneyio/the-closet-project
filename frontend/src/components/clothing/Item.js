import React, { useState } from 'react';

import { Card, Button, ListGroup } from 'react-bootstrap';
import UpdateModal from './UpdateModal';
import styled from 'styled-components';

const StyledCard = styled(Card)`
 box-shadow: -3px 3px 5px gray;
 & .card-img-top {
    width: 100%;
    height: 15vw;
    object-fit: cover;
}
.card-title {
    font-family: MyFont;
}
`;

export default function Item(props) {
    const [state, setState] = useState(false);
    const closeModalUpdate = () => setState(false);
   
    const { item } = props;
        return (

            <StyledCard>
                <Card.Img id={"itemDesign-img"} variant="top" src={item.cover} alt={item.name} />

                <Card.Body>
                    <Card.Title>
                    <p>{item.name}</p>
                        </Card.Title>
                        <ListGroup className="list-group-flush">
        <ListGroup.Item><b>Last worn</b>: {item.worn}</ListGroup.Item>
        <ListGroup.Item><b>Location</b>: {item.location}</ListGroup.Item>
        <ListGroup.Item><b>Type</b>: {item.ctype}</ListGroup.Item>
      </ListGroup>
                       
                      
                <Button size="sm" onClick={() => setState(true)} style={{color:'black'}}>Edit</Button>

                    <UpdateModal
                        closeModalUpdate={closeModalUpdate}
                        isOpenUpdate={state}
                        item={item}
                        types={props.types}
                        />

                
                </Card.Body>
            </StyledCard>
        );
    }

