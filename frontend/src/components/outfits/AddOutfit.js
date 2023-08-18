import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {Button, Form} from 'react-bootstrap';
import {addOutfit} from "../../middleware/OutfitActions";


export default function AddOutfit(props) {
    const [cname, setName] = useState('');
    const [date, setWorn] = useState('');
    const [about, setAbout] = useState('');
    const dispatch = useDispatch();


    // async function createFile(input) {
    //     let response = await fetch(input);
    //     let data = await response.blob();
    //     let metadata = {
    //         type: 'image/*'
    //     };
    //     return new File([data], input, metadata);
    // }
    //
    // const updated_items = async () => {
    //     let a = props.items
    //     for (const f of a) {
    //         f.cover = await createFile(f.cover);
    //     }
    //     return a
    // }
    const onAddClick = ()  => {
        // const formData = new FormData();
        // formData.append('about', about);
        // formData.append('name', cname);
        // formData.append('worn',date);
        // formData.append('items',items);
        const data = {
            "about":  about,
            "name": cname,
            "worn": date,
            "items": props.items
        }
        dispatch(addOutfit(data));

    };


    return (

                <Form >
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




