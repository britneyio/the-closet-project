import React from 'react';
import styled from 'styled-components';
import { Modal, Navbar, Container } from 'react-bootstrap';
import colors from './colors';
import { ModalHeader } from './fonts';
import {createGlobalStyle} from 'styled-components';

export const StyledModal = styled(Modal)`
    & .modal-content {
        background-color: ${colors.background1};
    }
    justify-content:space-between;
    button {
        background-color: ${colors.highlight1};
        margin-left: 20px;
        margin-top: 10px;
    }

    button:hover {
        background-color: ${colors.highlight3};
    }
`;

export const StyledNavbar = styled.div`
  height: 80px;
  width:100%;
  display:flex;
  justify-content: start;
  background-color: white;
  position:sticky;
  box-shadow: 3px 0 5px gray;
  button {
    background-color: ${colors.highlight1};
    border: none;
  }

   .nav-link:hover {
    background-color:${colors.highlight1};
    text-decoration:white wavy underline;
  }

  .nav-link {
    margin:0;
    padding:23px;
    font-size:20px;
    font-family: MyFont, serif;
  }

  .settings {
    padding:20px;
  }

  .right {
    margin-left:auto;
  }

  .nav-link.search:hover {
    background-color:white;
    text-decoration:none;
  }

  .search {
    padding:10px;
  }

  .search button {
    color:black;
    background-color: ${colors.highlight1};
  }

  .search button:hover {
    text-decoration: white wavy underline;
    background-color: ${colors.highlight1};
  }




  .nav-header {
    margin:0 25px;
    font-size:30px;
    padding-top:10px;
    font-family: MyFont;
    font-weight:bold;
  }

  button:hover {
    background-color:${colors.highlight3};
  }

`;

export const HomeStyles = createGlobalStyle`
  body {
  background-color:white;
  overflow-x:hidden;
  font-family:MyFont;
  }
  
`;

export const StyledPagination = styled.div`
text-align:center;
position: absolute;
bottom: 0;
width: 100%;
height: 50px;

& {
  margin: 0;
  padding:0;
}
`;

export const StyledSearchBar = styled.div`
  display:flex;
  justify-content: center;
  width:55%;
  margin:10px auto;
  input {
    width:400px;
  }
  
`;

export const PageContainer = styled.div`
position: relative;
min-height: 100vh;
`;


export const FlexWrapper = styled.div`
display:flex;
flex-direction:column;
align-items:space-between;
${StyledPagination} {

}
`;

export const StyledList = styled(Container)`
    display: flex;
    flex-direction:row;
    gap:25px; 
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