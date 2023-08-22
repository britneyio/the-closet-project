import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {Button, Form} from 'react-bootstrap';
import {addOutfit} from "../../middleware/OutfitActions";


export default function UpdateOutfit(props) {
    const outfit = props.outfit;
    const [cname, setName] = useState(outfit.name);
    const [date, setWorn] = useState(outfit.worn);
    const [about, setAbout] = useState(outfit.about);
    const [items, setItems] = useState(outfit.items_id);
    const dispatch = useDispatch();


    const onUpdateClick = async ()  => {
        const data = {
            "about":  about,
            "name": cname,
            "worn": date,
            "items_id": items,
        }
        dispatch(addOutfit(data));

    };


    return (

        <Form style={{width:'50%', margin:'0 auto'}}>
            <Form.Group controlId="nameId">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type="text"
                    name="outfitname"
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

            <Form.Group controlId="aboutId">
                <Form.Label>Last worn:</Form.Label>
                <Form.Control
                    type="text"
                    name="about"
                    value={about}

                    onChange={e => setAbout(e.target.value)}
                />
            </Form.Group>

            <Button  color="primary"
                     onClick={() => onUpdateClick()}>Add</Button>
        </Form>

    );
}




