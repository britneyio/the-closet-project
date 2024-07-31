import React from "react";
import styled from "styled-components";
import {Container} from "react-bootstrap";

const StyledSpace = styled(Container)`
   position:relative;
  display:block;
    width:100%;
    height:100vh;
  border:black 3px dotted;
  overflow:hidden;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('https://theshopcompany.com/media/catalog/product/cache/64943a40683afacbf6da243f93397706/m/p/mpf-full1-gry__front.jpg');
  .resizeable {
    width: 5em;
    height: 5em;
    border: 1px solid black;
    position: absolute;
    resize: both;
    overflow: hidden;
    border-radius: 0.3em;
  }

  div.main>div:hover {
    box-shadow: 0 0 5px black;
  }

  div.main>div:last-child {
    box-shadow: 0 0 10px black;
  }

  img.draggable {
    cursor: grab;
    width: inherit;
    height: inherit;
    display: flex;
  }
  div.no-drag {
    display: flex;
  }
  div.main div.no-drag:before {
    content: "can't move me";
  }
  div.draggable:before {
    content: "move me";
  }
  div.main div:before {
    color: black;
    text-shadow: 0 0 1em black;
    margin: auto;
    text-align: center;
  }

  div.main>div.dark:before {
    color: white;
    text-shadow: 0 0 1em white;
  }

  body.drag {
    user-select: none;
  }

  body.drag div.draggable {
    cursor: grabbing;
  }
    

  }
`;

export default function CreatorSpace(props) {

    if (props.items.length === 0) {
        return <StyledSpace><h2>Please add your first item</h2> </StyledSpace>;
    }
    let items = props.items.map(item => {

        return  <div
            key={item.id}
            className={"resizeable"}
        ><img
className={'draggable'}

            src={item.cover_file}

        /></div>
    });
    //mouse

    let x, y, drag;
    document.addEventListener("mousedown", function(e) {
        if (e.target.parentNode.lastChild !== e.target && e.target.parentNode.classList.contains("main")) {
            //bring element to the front and dispatch mousedown event again otherwise resize doesn't work
            e.target.parentNode.appendChild(e.target);
            return e.target.dispatchEvent(new MouseEvent(e.type, e));
        }

        if (!e.target.classList.contains("draggable"))
            return;

        e.preventDefault();
        drag = e.target.parentNode;
        x = e.x - drag.offsetLeft;
        y = e.y - drag.offsetTop;
        document.body.classList.add("drag");
        drag.classList.add("drag");
    });

    document.addEventListener("mouseup", function(e) {
        document.body.classList.remove("drag");
        drag = drag && drag.classList.remove("drag");
    });

    document.addEventListener("mousemove", function(e) {
        if (!drag || e.x - drag.offsetLeft == x || e.y - drag.offsetTop == y)
            return;

        drag.style.left = (e.x - x) + "px";
        drag.style.top = (e.y - y) + "px";
    });

    // touch

    document.addEventListener("touchstart", function(e) {
        if (e.target.parentNode.lastChild !== e.target && e.target.parentNode.classList.contains("main")) {
            //bring element to the front and dispatch mousedown event again otherwise resize doesn't work
            e.target.parentNode.appendChild(e.target);
            return e.target.dispatchEvent(new MouseEvent(e.type, e));
        }

        if (!e.target.classList.contains("draggable"))
            return;

        e.preventDefault();
        drag = e.target.parentNode;
        x = e.x - drag.offsetLeft;
        y = e.y - drag.offsetTop;
        document.body.classList.add("drag");
        drag.classList.add("drag");
    });

    document.addEventListener("touchend", function(e) {
        document.body.classList.remove("drag");
        drag = drag && drag.classList.remove("drag");
    });

    document.addEventListener("touchmove", function(e) {
        if (!drag || e.x - drag.offsetLeft == x || e.y - drag.offsetTop == y)
            return;

        drag.style.left = (e.x - x) + "px";
        drag.style.top = (e.y - y) + "px";
    });



    return(

        <StyledSpace className={'main'} fluid>
            {items}
        </StyledSpace>
    );
}

