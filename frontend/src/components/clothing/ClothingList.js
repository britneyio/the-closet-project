import React, {useState} from 'react';
import Item from './Item';
import {Button, Col, Container, Row} from 'react-bootstrap';
import AddClothingItem from "./AddClothingItem";
import colors from "../../common/colors";


export default function ClothingList(props) {
    const [state, setState] = useState(false);

    if (props.clothing.length === 0) {
            return <h2>Please add your first item</h2>;
        }

    const openModalAdd = () => setState(true);
    const closeModalAdd = () => setState(false);

        return(
            <Container style={{margin:'25px 0'}}>
                <AddClothingItem
                    closeModalAdd={closeModalAdd}
                    isOpenAdd={state}
                    types={props.types}
                />
                <Button style={{margin: "5px 0 ", backgroundColor:colors.highlight1, border:"none", color:"black"}}onClick={openModalAdd}>Add Item</Button>
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



