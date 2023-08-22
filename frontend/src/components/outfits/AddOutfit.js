import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {Button, Form} from 'react-bootstrap';
import {addOutfit} from "../../middleware/OutfitActions";


export default function AddOutfit(props) {
    const [cname, setName] = useState('');
    const [date, setWorn] = useState('');
    const [about, setAbout] = useState('');
    const [items, setItems] = useState(props.items);
    const dispatch = useDispatch();


    const onAddClick = async ()  => {
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
                             onClick={() => onAddClick()}>Add</Button>
                </Form>

    );
}




