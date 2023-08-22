import React, { Component, useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import withRouter from '../../withRouter';
import {connect, useDispatch} from "react-redux";
import styled from 'styled-components';
import { updateOutfit } from '../../middleware/OutfitActions';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import UpdateOutfit from "./UpdateOutfit";
import {useNavigate} from "react-router";

const StyledCard = styled(Card)`
 & .card-img-top {
    width: 100%;
    height: 15vw;
    object-fit: cover;
}
`;



export default function Outfit(props) {
    const navigate = useNavigate();
   
    const { outfit } = props;
    const images = outfit.items.map(item =>
        <img key={item.id}
        src={item.cover_file ? item.cover_file : item.cover_url}
        style={{
            display: 'block',
            height: '100%',
            margin: 'auto',
            width: '100%'
          }}
        />
    )
        return (

            <StyledCard>
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
                {/* <Card.Img id={"itemDesign-img"} variant="top" src={outfit.items[0].cover} alt={outfit.name} /> */}

                <Card.Body>
                    <Card.Title>
                    <p>{outfit.name}</p>
                        </Card.Title>
                        <ListGroup className="list-group-flush">
        <ListGroup.Item>Last worn: {outfit.worn}</ListGroup.Item>
        <ListGroup.Item>{outfit.about}</ListGroup.Item>
        {/* <ListGroup.Item>{outfit.items}</ListGroup.Item> */}
      </ListGroup>
                       
                      
                <Button size="sm" onClick={() => navigate(`outfit-creator/${outfit.id}/edit`)} style={{color:'black'}}>Edit</Button>

                
                </Card.Body>
            </StyledCard>
        );
    }






