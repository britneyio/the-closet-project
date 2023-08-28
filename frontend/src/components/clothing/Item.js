import React, { useState } from 'react';

import { Card, Button, ListGroup } from 'react-bootstrap';
import UpdateModal from './UpdateModal';
import styled from 'styled-components';
import colors from "../../common/colors";

const StyledCard = styled(Card)`
  margin:10px;
  border-radius: 2px;
 & .card-img-top {
    width: 100%;
    height: 15vw;
    object-fit: cover;
}
.card-title {
    font-family: MyFont;
}
  button {
    background-color: ${colors.highlight1};
    border:none;
  }
  
    button:focus {
    background-color: ${colors.highlight3};
  }
  
  button:hover {
    background-color: ${colors.highlight5};
  }
  
  button:active {
    background-color: ${colors.highlight3};
  }
  
  .btn-primary:active {
    background-color: ${colors.highlight5};

  }
  
  .btn:active {
    background-color: ${colors.highlight5};

  }
`;

export default function Item(props) {
    const [state, setState] = useState(false);
    const closeModalUpdate = () => setState(false);
   
    const { item } = props;
        return (

            <StyledCard>
                <Card.Img id={"itemDesign-img"} variant="top" src={item.cover_file} alt={item.name} />

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

