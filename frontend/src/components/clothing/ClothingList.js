import React from 'react';
import Item from './Item';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import colors from '../../common/colors';

const StyledList = styled(Container)`
    display: flex;
    flex-direction:row;
    gap:50px;
    position: relative;
    overflow:hidden;
    width:100%;
    flex-wrap:wrap;
    top:50px;
    left:150px;
    padding:20px 45px 45px 45px;
    .card {
        width: 300px;
    }

    .card button {
        margin: 20px 0;
        background-color:${colors.highlight1};
        border: none;
        margin-right:15px;
    }
    .card button:hover {
        background-color:${colors.highlight3};
    }

  @media screen and (max-width: 480px) {
    gap:0;
    padding:0;
    top:150px;
    left:0;
    display: ${props => props.navState ? 'none' : 'block'};
    .card {
      width: 300px;
      margin:20px auto;
    }

    .card button {
      margin: 10px 0;
      background-color:${colors.highlight1};
      border: none;
    }


  }
`;


export default function ClothingList(props) { 
        if (props.clothing.length === 0) {
            return <h2>Please add your first item</h2>;
        }
        let items = props.clothing.map(item => {

            return  <Item key={item.id} item={item} />;
        });

        return(
              
            <StyledList navState={props.navState}>
              {items}
              </StyledList>
        );
    }



