import React from 'react';
import Item from './Item';
import {Col, Container, Row} from 'react-bootstrap';


export default function ClothingList(props) { 
        if (props.clothing.length === 0) {
            return <h2>Please add your first item</h2>;
        }

        return(
            <Container style={{marginTop:'25px'}}>
            <Row xs={1} md={2} lg={3} className="g-3">
                {props.clothing.map((item, idx) => (
                    <Col key={idx}>
                        <Item key={item.id} item={item} />
                    </Col>
                ))}
            </Row>
            </Container>

        );
    }



