import React, { useState } from 'react';
import Type  from './Type';
import styled from 'styled-components';
import colors from '../../common/colors';
import AddType from "./AddType";
import {Button, Nav, Navbar} from "react-bootstrap";

const MyNavButtons = styled(Nav.Item)`
    height:50px;
    width: 100%;
    background-color:${colors.highlight4};
    color:black;
    text-align:center;
    padding-top:10px;
    font-family: MyFont, sans-serif;
    position:relative;
    border-bottom: 1px solid white;

    .nav-link {
      color:black;
    }
  
    :hover {
      background-color: ${colors.highlight3};
    }
`;



const Bar = styled(Navbar)`
  background-color: ${colors.highlight4};
  overflow:scroll;
  max-height:100%;
  padding: 0;

  .btn-primary {
    background-color: ${colors.highlight4};
    border:none;
  }

  .btn-primary:focus {
    background-color: ${colors.highlight3};
  }

  .btn-primary:hover {
    background-color: ${colors.highlight5};
  }
  
  .btn-primary:active {
    background-color: ${colors.highlight5};

  }
  
  .btn:active {
    background-color: ${colors.highlight5};

  }
  ${Button} {
    color:black;
  }
  
  ${Navbar} {
    height: 100%;

  }
`;

export default function TypeList(props) {
        const [state, setState] = useState(false);
    const openModalAdd = () => setState(true);
    const closeModalAdd = () => setState(false);

        if (props.types.length === 0) {
            return <h2>Please add your first type</h2>;
        }
        let typeList = props.types.map(t =>
              <Type  key={t.id} type={t} isClicked={props.isClicked}  />);

        return (
<>
              <AddType
                  closeModalAdd={closeModalAdd}
                  isOpenAdd={state}
              />
        <Bar expand='lg' className={'flex-column'}>
    <Navbar.Brand href="#home">Clothing types  <Button onClick={openModalAdd} style={{color:"black", fontWeight:"bold"}}>+</Button></Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav" style={{backgroundColor:'white'}}>
     <Nav defaultActiveKey="/home" className="flex-column">
          <MyNavButtons key={"all"} onClick={() => props.isClicked("all")}>
             All</MyNavButtons>
         {typeList}
     </Nav>
    </Navbar.Collapse>
        </Bar>
        
          </>
  
        );
        
  }



