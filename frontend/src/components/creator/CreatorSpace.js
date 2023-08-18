import React from "react";
import styled from "styled-components";

const StyledSpace = styled.div`
   background-color:white;
   position:relative;
    top:0;
    bottom: 0;
    left: 100px;
    right: 0;
    width:75%;
    height:100vh;
    margin: 0 auto;
  border:black 3px dotted;
  display:flex;
  box-sizing: border-box;
`;

export default function CreatorSpace(props) {
    if (props.items.length === 0) {
        return <StyledSpace><h2>Please add your first item</h2> </StyledSpace>;
    }
    let items = props.items.map(item => {

        return  <div
            key={item.id}
            className={"movable-element"}
            onMouseDown={(e) => pickup(e)}
            onTouchStart={(e) => pickup(e)}
            onMouseMove={(e) => move(e)}
            onTouchMove={(e) => move(e)}
            onMouseUp={(e) => drop(e)}
            onTouchEnd={(e) => drop(e)}

        ><img
            style={{height:"150px", width:"150px"}}

            src={item.cover}

        /></div>
    });

    let moving = null;

    const pickup = (e) => {
        moving = e.target;
        moving.style.position = 'fixed';
        moving.style.height = moving.clientHeight;
        moving.style.width = moving.clientWidth;
    }

    const move = (e) => {
        if (moving) {
            if (e.clientX) {
                //mousemove

                moving.style.left = e.clientX - moving.clientWidth/2 + 'px';
                moving.style.top = e.clientY - moving.clientHeight/2 + 'px';
            } else  {
                // touchmove
                moving.style.left = e.changedTouches[0].clientX - moving.clientWidth/2 + 'px';
                moving.style.top = e.changedTouches[0].clientY - moving.clientHeight/2 + 'px';
            }

        }
    }

    const drop = (e) => {
        if (moving) {
            // reset element
            moving = null;

        }
    }


    return(

        <StyledSpace>
            {items}
        </StyledSpace>
    );
}

