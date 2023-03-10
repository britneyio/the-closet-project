import React from 'react';
import {useSelector } from 'react-redux';
import Item from './Item';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import colors from '../../common/colors';

const StyledList = styled(Container)`
    display: flex;
    flex-direction:row;
    gap:15px;
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
`;


export default function ClothingList(props) { 
        if (props.clothing.length === 0) {
            return <h2>Please add your first item</h2>;
        }
        let items = props.clothing.map(item => {

            return  <Item key={item.id} item={item} />;
        });

        return(
              
            <StyledList >
              {items}
              </StyledList>
        );
    }
