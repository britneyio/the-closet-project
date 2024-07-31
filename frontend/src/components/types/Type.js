import React, {useState} from 'react';
import {Dropdown, Nav} from 'react-bootstrap';
import UpdateType from "./UpdateType";
import styled from "styled-components";
import colors from "../../common/colors";

const MyNavButtons = styled.div`
    min-width: 100%;
    background-color:${colors.highlight4};
    color:black !important;
    text-align:center;
    font-family: MyFont, sans-serif;
    position:relative;
    height: 40px;
  padding:0 55px;
    :hover, .nav-link:hover {
      background-color:${colors.highlight3};
    }
  .nav-link {
    color:black !important;
  }

`;

export default function Type(props)  {
    const [state, setState] = useState(false);
    const closeModalUpdate = () => setState(false);

    const { type } = props;
        return (
            <MyNavButtons onClick={(e) => {props.isClicked(type.name); e.stopPropagation()}} className={"types"}>
                <Nav.Link> {type.name} </Nav.Link>
                <Dropdown style={{position:"absolute",top:0,right:0}} onClick={(e) => e.stopPropagation()}>
                    <Dropdown.Toggle id={'dropdown-custom-1'} style={{backgroundColor:'transparent', border:'none',color:'black'}}>
                        {/*<img width="15px" src="https://img.icons8.com/ios-glyphs/30/null/menu-2.png"/>*/}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => { setState(true); }} >
                            Edit
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                 <UpdateType type={type} isOpenUpdate={state} closeModalUpdate={closeModalUpdate}/>

            </MyNavButtons>


        );
    }

