import React, {useState} from 'react';
import styled from 'styled-components';
import {Modal, Navbar, Container, Form, Button, Nav} from 'react-bootstrap';
import colors from './colors';
import { ModalHeader } from './fonts';
import {createGlobalStyle} from 'styled-components';
import {SettingFilled} from "@ant-design/icons";
import {useNavigate} from "react-router";
import AddClothingItem from "../components/clothing/AddClothingItem";
import UserSettings from "../components/closet/UserSettings";
import {Link} from "react-router-dom";
export const StyledModal = styled(Modal)`

    justify-content:space-between;
  & button {
    background-color: ${colors.highlight1};
    color: black;
    border: none;
  }
  & button:hover {
    background-color: ${colors.highlight3};

    & button:focus {
      background-color: ${colors.highlight3};
    }

    & button:active {
      background-color: ${colors.highlight3} !important;
    }
      ${Link} {
      background-color: ${colors.highlight4};
      }
    }
`;

export const StyledNavbar = styled(Navbar)`
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

  .navbar-brand {
    font-size:30px;
    margin-left:10px;
  }
   .nav-link:hover {
    background-color:${colors.highlight1};
    text-decoration:white wavy underline;
     min-height:100%;
  
  }

  .nav-link {
    margin:0;
    padding:23px;
    font-size:20px;
    font-family: MyFont, serif;
    cursor: pointer;
    color:black;
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

  .active {
    background-color:${colors.highlight1};
    text-decoration:white wavy underline;
  }

  .search button {
    color:black;
    background-color: ${colors.highlight1};
  }
  
  .nohover:hover {
    background-color:white;
  }

  .search button:hover {
    text-decoration: white wavy underline;
    background-color: ${colors.highlight1};
  }

  .signLink {
    margin-left:auto;
    margin-right:20px;
    div  {
      display:inline-block;
      height:100%;
    }
    
    
  }




  .nav-header {
    margin:0 25px;
    font-size:30px;
    padding-top:15px;
    font-family: MyFont, serif;
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
  font-family:MyFont, sans-serif;
  }
  button {
    background-color: ${colors.highlight1};
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
  @media screen and (max-width: 480px) {
    overflow-x:hidden;
  }
`;


export const FlexWrapper = styled.div`
display:flex;
flex-direction:column;
  @media screen and (max-width: 480px) {
    flex-direction: row;
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

export const StyledNavbarComponent = ({user, currentPage, search, setSearch, handleSearch}) => {
    const [state, setState] = useState(false);
    const openModalAdd = () => {setState(true);};
    const closeModalAdd = () => setState(false);
    const navigate = useNavigate();
    const handleOutfitLink = () => {
        navigate("/outfits");
    };
    const handleOutfitCreatorLink = () => {
        navigate("/outfit-creator");
    }

    const handleClosetLink = () => {
        navigate("/closet");
    }

    return (
        <StyledNavbar  collapseOnSelect expand="lg" className="bg-body-tertiary">
                    <Navbar.Brand href="#home"> {!currentPage.includes("Creator") ?
                        <div className="nav-header">{`${user.username}'s ${currentPage}`}</div>
                        :
                        <div className="nav-header">{currentPage}</div>}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">

                        <Nav className="me-auto">
            <Nav.Link className={currentPage.includes("Closet")  ? "nav-link active" : "nav-link"} onClick={handleClosetLink}>Closet</Nav.Link>
            <Nav.Link className={currentPage.includes("Outfits")  ? "nav-link active" : "nav-link"} onClick={handleOutfitLink}>Outfits</Nav.Link>
            <Nav.Link className={currentPage.includes("Creator")  ? "nav-link active" : "nav-link"} onClick={handleOutfitCreatorLink}>Outfit Creator Tool</Nav.Link>
            <Nav.Link className="nav-link search">
            </Nav.Link>
                        </Nav>
                            <StyledSearchBar><Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Find my favorite item"
                    className="me-2"
                    aria-label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-success"  onClick={handleSearch}>Search</Button>
            </Form></StyledSearchBar>
            <Nav>
                <Nav.Link>
                    <div className="nav-link settings right" onClick={openModalAdd}><SettingFilled /></div>

                    <UserSettings
                closeModalUpdate={closeModalAdd}
                isOpenUpdate={state}
                user={user}
            />
                </Nav.Link>
            </Nav>
                </Navbar.Collapse>


        </StyledNavbar>
    )
}

export const Footer = styled(Container)`
  position: relative;
  bottom: 0;
  background-color: white;
  min-width: 100%;
  height: 2.5rem;
  border-top: 1px #c5c2c2 solid;
  display: block;
  text-align:center;
  p {
    font-family: sans-serif;
  }
  padding:10px 0;
`;