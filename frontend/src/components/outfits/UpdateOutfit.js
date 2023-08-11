import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {Button, Form, Modal, Dropdown, Card} from 'react-bootstrap';
import { updateItem, deleteItem } from '../../middleware/ClothingActions';
import withRouter from '../../withRouter';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {StyledModal} from "../../common/inputs";
import {deleteOutfit, updateOutfit} from "../../middleware/OutfitActions";
import Carousel from "react-multi-carousel";

const ButtonGroup = styled.div`
    display:flex;
    justify-content:space-between;
`;



export default function UpdateOutfit(props) {
    const outfit = props.outfit;
    const [cname, setName] = useState(outfit.name);
    const [date, setWorn] = useState(outfit.worn);
    const [images, setImages] = useState(outfit.items);
    const [about, setAbout] = useState(outfit.about)
    const dispatch = useDispatch();




    const handleImages =  (e) => {
        let im = images
        im.push(e.target.files)
        setImages(im)
    }

    async function createFile(input) {
        let response = await fetch(input);
        let data = await response.blob();
        let metadata = {
            type: 'image/jpg'
        };
        return new File([data], input, metadata);
    }

    async function createFiles(files) {
        let im = images
        for(let i = 0; i < images.length; i++) {
            if (!(images[i] instanceof File)) {
                im[i] = await createFile(images[i])
            }
        }
    }

    const onDeleteClick = () => {

        const { outfit } = props;
        dispatch(deleteOutfit(outfit.id));
    };
    const onUpdateClick = async ()  => {
        const formData = new FormData();
        const im = createFiles(images)
        formData.append('images', im);
        formData.append('name', cname);
        formData.append('worn', date);
        formData.append('about', about)
        dispatch(updateOutfit(outfit.id,formData));

    };

    return (
        <StyledModal
            show={props.isOpenUpdate}
            onHide={props.closeModalUpdate}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h2>Edit outfit</h2>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <Form.Group controlId="nameId">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="clothingname"
                            placeholder={outfit.name}
                            value={cname}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="wornId">
                        <Form.Label>Last worn:</Form.Label>
                        <Form.Control
                            type="date"
                            name="lastworn"
                            value={outfit.worn}

                            onChange={e => setWorn(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="clothingId">
                        <Form.Label>List of the clothing:</Form.Label>

                    </Form.Group>
                    <Form.Group controlId="imagesId">
                            <Carousel
                                additionalTransfrom={0}
                                arrows
                                autoPlaySpeed={3000}
                                centerMode={false}
                                className=""
                                containerClass="container"
                                dotListClass=""
                                draggable
                                focusOnSelect={false}
                                infinite={false}
                                itemClass=""
                                keyBoardControl
                                minimumTouchDrag={80}
                                pauseOnHover
                                renderArrowsWhenDisabled={false}
                                renderButtonGroupOutside={false}
                                renderDotsOutside={false}
                                responsive={{
                                    desktop: {
                                        breakpoint: {
                                            max: 3000,
                                            min: 1024
                                        },
                                        items: 1
                                    },
                                    mobile: {
                                        breakpoint: {
                                            max: 464,
                                            min: 0
                                        },
                                        items: 1
                                    },
                                    tablet: {
                                        breakpoint: {
                                            max: 1024,
                                            min: 464
                                        },
                                        items: 1
                                    }
                                }}
                                rewind={false}
                                rewindWithAnimation={false}
                                rtl={false}
                                shouldResetAutoplay
                                showDots
                                sliderClass=""
                                slidesToSlide={1}
                                swipeable
                            >
                                {images}

                            </Carousel>
                        <Form.Control
                            type="file"
                            name="images"
                            onChange={handleImages}
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





