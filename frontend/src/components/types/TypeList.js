import React, { useState } from 'react';
import Type  from './Type';
import styled from 'styled-components';
import colors from '../../common/colors';
import AddClothingItem from "../clothing/AddClothingItem";
import AddType from "./AddType";




const MyNav = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    overflow-y:scroll !important;

  @media screen and (max-width: 480px) {
    display:block;
    
  }
`;



const MyNavContainer = styled.div`
    position: absolute;
    min-height:100%;
    background-color:${colors.highlight1};
    width:200px;
    border-radius:10px;
    box-shadow: 1px 0 5px gray;
  
    @media screen and (max-width: 480px) {
      max-width:100%;
      width:100%;
      margin: 150px 0 0 0;
      height: 100px;
      box-shadow:none;
      border-radius:3px;
      

    }

    @media screen and (max-width: 768px) {

  }
`;

const MyNavHeader = styled.div`
    display:flex;
    justify-content:space-between;
    padding: 10px 10px 0 10px;
  @media screen and (max-width: 480px) {
    padding:0;

  }
`;

const ClosedNav = styled.div`
position: absolute;
min-height:100%;
background-color:${colors.highlight1};;
width:35px;
  @media screen and (max-width: 480px) {
    max-width:480px;
    width: 100%;
    height: 50px;
    min-height:50px;
    #threelines {
      float:right;
    }
    margin: 150px 0 0 0;

  }
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

  @media screen and (max-width: 480px) {
  

  }
`;

export default function TypeList(props) {
    // const [navState, setNavState] = useState(true);
        const [state, setState] = useState(false);
    const openModalAdd = () => setState(true);
    const closeModalAdd = () => setState(false);

        if (props.types.length === 0) {
            return <h2>Please add your first type</h2>;
        }
        let typeList = props.types.map(t =>
                <Type  className={"types"} key={t.id} type={t} isClicked={props.isClicked}  />);

        return (
<>

      {props.navState ? <MyNavContainer>
      <MyNav>
        <MyNavHeader>
          <div>
          Clothing Types
          </div>
            <button onClick={openModalAdd}>
                Add type
            </button>
            <AddType
                closeModalAdd={closeModalAdd}
                isOpenAdd={state}
            />
          <div>
        <img onClick={() => props.setNavState(false)}src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/null/external-hamburger-basic-ui-jumpicon-glyph-jumpicon-glyph-ayub-irawan-2.png"/>
        </div>
          </MyNavHeader>
      <MyNavButtons key={"all"} onClick={() => props.isClicked("all")}> 
                All</MyNavButtons>
            {typeList}

      </MyNav>
      </MyNavContainer>

      : <ClosedNav>
                  <div id={"threelines"}>
        <img onClick={() => props.setNavState(true)}src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/null/external-hamburger-basic-ui-jumpicon-glyph-jumpicon-glyph-ayub-irawan-2.png"/>
        </div>
      </ClosedNav> }
     
        
          </>
  
        );
        
  }



