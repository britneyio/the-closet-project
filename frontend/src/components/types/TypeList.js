import React, { useState } from 'react';
import Type  from './Type';
import styled from 'styled-components';
import colors from '../../common/colors';




const MyNav = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    overflow-y:auto;
`;



const MyNavContainer = styled.div`
    position: absolute;
    min-height:100%;
    background-color:${colors.highlight1};
    width:200px;
    border-radius:10px;
    box-shadow: 1px 0 5px gray;
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

export default function TypeList(props) {
    const [navState, setNavState] = useState(true);

        if (props.types.length === 0) {
            return <h2>Please add your first type</h2>;
        }
        let typeList = props.types.map(t =>
                <Type  key={t.id} type={t} isClicked={props.isClicked}/>);

        return (
<>

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



