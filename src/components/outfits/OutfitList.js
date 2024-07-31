import React from 'react';
import Outfit from './Outfit';
import {Col, Container, Row} from "react-bootstrap";


export default function OutfitList(props) {

        if (props.outfits.length === 0) {
            return <h2>Please add your first item</h2>;
        }


        return(
            <Container style={{marginTop:'25px'}}>
                <Row xs={1} md={2} lg={3} className="g-3">
                    {props.outfits.map((item, idx) => (
                        <Col key={idx}>
                            <Outfit key={item.id} outfit={item} />
                        </Col>
                    ))}
                </Row>
            </Container>
        );
    }



