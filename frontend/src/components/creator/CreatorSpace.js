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
`;

export default function CreatorSpace(props) {
    if (props.items.length === 0) {
        return <StyledSpace><h2>Please add your first item</h2> </StyledSpace>;
    }
    let items = props.items.map(item => {

        return  <img style={{height:"150px", width:"150px"}} key={item.id} src={item.cover}/>
    });

    return(

        <StyledSpace>
            {items}
        </StyledSpace>
    );
}

