import React, {  useState} from 'react';
import { useDispatch} from 'react-redux';

import { Button, Form } from 'react-bootstrap';
import { addItem } from '../../middleware/ClothingActions';


export default function AddOutfit(props) {
    const [cname, setName] = useState('');
    const [date, setWorn] = useState('');
    const [about, setAbout] = useState('');
    const [items, setItems] = useState([]);
    const dispatch = useDispatch();



    const onAddClick = ()  => {
        const formData = new FormData();
        formData.append('about', about);
        formData.append('name', cname);
        formData.append('worn',date);
        formData.append('items',items);
        dispatch(addItem(formData));

    };

    const createItem = () => {

    }


    return (

                <Form >
                    <Form.Group controlId="nameId">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="clothingname"
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

                    <Button  color="primary"
                             onClick={() => onAddClick()}>Create</Button>
                </Form>

    );
}




