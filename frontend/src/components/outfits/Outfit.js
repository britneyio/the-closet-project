import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colors from "../../common/colors";
import {Link} from "react-router-dom";

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



export default function Outfit(props) {

    const { outfit } = props;
    const images = outfit.items.map(item =>
        <img key={item.id}
        src={item.cover_file}
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
                       
                      
               <Link to={`/outfit-creator/${outfit.id}/edit`} state={{
                   outfits : outfit
               }}> <Button size="sm" style={{color:'black'}}>Edit</Button></Link>

                
                </Card.Body>
            </StyledCard>
        );
    }






