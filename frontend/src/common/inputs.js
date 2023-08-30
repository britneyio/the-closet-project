import React, {useState} from 'react';
import styled from 'styled-components';
import {Modal, Navbar, Container, Form, Button, Nav, Pagination} from 'react-bootstrap';
import colors from './colors';
import {createGlobalStyle} from 'styled-components';
import {SettingFilled} from "@ant-design/icons";
import {useNavigate} from "react-router";
import UserSettings from "../components/closet/UserSettings";
import ReactPaginate from "react-paginate";
import {getClothing} from "../middleware/ClothingActions";
import {useDispatch} from "react-redux";
export const StyledModal = styled(Modal)`
  
  max-width: 100%;
  width:75%;
 
    justify-content:space-between;
  & button {
    background-color: ${colors.highlight1};
    color: black;
    border: none;
  }
  & button:hover {
    background-color: ${colors.highlight3};
  }

    & button:focus {
      background-color: ${colors.highlight3};
    }

    & button:active {
      background-color: ${colors.highlight3} !important;
    }
    & .modal-footer a {
      color: ${colors.highlight3} !important;
      }
    
`;

export const StyledNavbar = styled(Navbar)`
  z-index: 100;

  height: 80px;
  width:100%;
  display:flex;
  justify-content: start;
  background-color: white;
  position:sticky;
  box-shadow: 3px 0 5px gray;
  .show .nav-link {
    background-color: white;
  }
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
  font-family:MyFont, sans-serif;
  }
  button {
    background-color: ${colors.highlight1};
  }
  

  
`;

function Items({ currentItems }) {
    return (
        <Pagination>
            {
                currentItems.map((item) => (
                    <Pagination.Item key={item.name + item.id}>
                        <h3>Item #{item.name}</h3>
                    </Pagination.Item>
                ))}
        </Pagination>
    );
}


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
                    name={"q"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-success"  onClick={handleSearch} onSubmit={handleSearch}>Search</Button>
            </Form></StyledSearchBar>
            <Nav>
                <Nav.Link className="nav-link" onClick={openModalAdd}>
                    <SettingFilled />
                </Nav.Link>
            </Nav>
                </Navbar.Collapse>

            <UserSettings
                closeModalUpdate={closeModalAdd}
                isOpenUpdate={state}
                user={user}
            />
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