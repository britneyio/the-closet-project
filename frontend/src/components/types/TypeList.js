import React, { useState } from 'react';
import Type  from './Type';
import { useSelector } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';
import {FileAddOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import colors from '../../common/colors';
import AddType from './AddType';



const MyNav = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    overflow-y:auto;
`;

const MyNavButtons = styled.div`
    height:50px;
    width: 100%;
    background-color:${colors.highlight1};
    color:black;
    text-align:center;
    padding-top:10px;
    font-family: MyFont;
    position:relative;
    border-bottom: 1px solid white;
    &:hover {
      background-color:${colors.highlight3};
    }
`;

const MyNavContainer = styled.div`
    position: absolute;
    min-height:100%;
    background-color:${colors.highlight1};
    width:200px;
    border-radius:10px;
`;

const MyNavHeader = styled.div`
    display:flex;
    justify-content:space-between;
    padding: 10px 10px 0 10px;
`;

const ClosedNav = styled.div`
position: absolute;
min-height:100%;
background-color:${colors.highlight1};;
width:35px;
`;

const selectTypes = state => state.types;

export default function TypeList(props) {
    const [state, setState] = useState(false);
    const closeModalAdd = () => setState(false);
    const [navState, setNavState] = useState(true);
    const types = useSelector(selectTypes);

    const tList = types.types;

    const handleTypeModal = (e) => {

    }

        if (tList.length === 0) {
            return <h2>Please add your first type</h2>;
        }
        let typeList = tList.map(item => {

            return  <MyNavButtons key={item.id} onClick={() => props.isClicked(item.name)}> 
                <div style={{position:"absolute",top:0,right:0}} onClick={handleTypeModal}>
                <img width="15px" src="https://img.icons8.com/ios-glyphs/30/null/menu-2.png"/>
                </div>
                <Type id="typelink" key={item.id} type={item} /> 

                </MyNavButtons>;
        });

        const handleToggle = () => {
          setNavState(false);
        };

        return (
<>
            {/* <StyledNav variant="tabs"  className="flex-lg-column">
                {state ? <AddType 
                isOpenTypeAdd={state}
                closeModalTypeAdd={closeModalAdd}
                /> : null }
             <Nav.Item onClick={() => props.isClicked("all")}>Categories <FileAddOutlined onClick={() => setState(true)} /> </Nav.Item> */}
      {navState ? <MyNavContainer>
      <MyNav>
        <MyNavHeader>
          <div>
          Clothing Types
          </div>
          <div>
        <img onClick={() => setNavState(false)}src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/null/external-hamburger-basic-ui-jumpicon-glyph-jumpicon-glyph-ayub-irawan-2.png"/>
        </div>
          </MyNavHeader>
      <MyNavButtons key={"all"} onClick={() => props.isClicked("all")}> 
                All</MyNavButtons>
            {typeList}

      </MyNav>
      </MyNavContainer>

      : <ClosedNav>
                  <div>
        <img onClick={() => setNavState(true)}src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/null/external-hamburger-basic-ui-jumpicon-glyph-jumpicon-glyph-ayub-irawan-2.png"/>
        </div>
      </ClosedNav> }
     
        
          </>
  
        );
        
  }



