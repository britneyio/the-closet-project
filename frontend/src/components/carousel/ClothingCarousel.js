import React, {useEffect, useState} from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled from 'styled-components';
import colors from '../../common/colors';
const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const ItemCard = styled.div`
    height:300px;
    width: 300px;
    text-align:center;
    img {
      margin: 10px 20px;
      box-shadow: 1px 1px 2px gray;
    }
    h3 {
      margin: 0 20px 10px 20px;
    }
  `;
const StyledCarousel = styled.div`
    & .clothing-item {
      width:200px !important;
    }
    border: 5px solid ${colors.highlight1};
    width:75%;
    height:250px;
    margin-left: 300px;
    margin-top: 10px;
    margin-bottom:10px;
    box-shadow: 3px 3px 5px gray;

    img {
      border: 1px solid ${colors.highlight1};

    }

`;

ClothingCarousel.defaultProps = {

}
export default function ClothingCarousel(props) { 
    const [isClicked, setIsClicked] = useState([]);
    const [items, setItems] = useState([]);

    const init = async () => {
        let unclicked = props.clothing.map((item,index) =>  {
            if (isClicked[index]) {
               return <ItemCard key={item.id} onClick={() => {handleClick(index)}} style={{backgroundColor:"red"}}>
                    <img  style={{height:"150px", width:"150px"}} src={item.cover} />
                </ItemCard>;
            }
            return <ItemCard key={item.id} onClick={() => handleClick(index)} >
                <img  style={{height:"150px", width:"150px"}} src={item.cover} />
            </ItemCard>;
        });



        await setItems(unclicked);

    }

    useEffect(() => {
        init();
    }, [items]);

    if (props.clothing.length === 0) {
        return <h2>Please add your first item</h2>;
    }

    const handleClick = (id) => {
        let clicked = isClicked;
        clicked[id] = !isClicked[id];
        setIsClicked([...clicked]);




    }



    return(

      
         <StyledCarousel>
           <h3>Add item</h3>
        <Carousel
  swipeable={true}
  draggable={true}
  showDots={true}
  responsive={responsive}
  ssr={true}
  infinite={true}
  autoPlay={false}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  customTransition="all .5"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  deviceType={props.deviceType}
  dotListClass="custom-dot-list-style"
  renderButtonGroupOutside
  itemClass="clothing-item"
>
    {items}
</Carousel>
</StyledCarousel> 
    );
}