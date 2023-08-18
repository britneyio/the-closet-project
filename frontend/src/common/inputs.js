import React, {useState} from 'react';
import styled from 'styled-components';
import {Modal, Navbar, Container, Form, Button} from 'react-bootstrap';
import colors from './colors';
import { ModalHeader } from './fonts';
import {createGlobalStyle} from 'styled-components';
import {SettingFilled} from "@ant-design/icons";
import {useNavigate} from "react-router";
import AddClothingItem from "../components/clothing/AddClothingItem";
import UserSettings from "../components/closet/UserSettings";
export const StyledModal = styled(Modal)`

    justify-content:space-between;
  & button {
    background-color: ${colors.highlight1};
    color: black;
    border: none;
  }
  & button:hover {
    background-color: ${colors.highlight3};
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
    cursor: pointer;
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

export const StyledNavbarComponent = ({user, currentPage, search, setSearch, handleSearch}) => {
    const [state, setState] = useState(false);
    const openModalAdd = () => {setState(true); console.log("hji")};
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
        <StyledNavbar expand="lg" sticky="top">
            {!currentPage.includes("Creator") ?
                <div className="nav-header">{user.username}'s {currentPage}</div>
                :
                <div className="nav-header">{currentPage}</div>}

            <div className={currentPage.includes("Closet")  ? "nav-link active" : "nav-link"} onClick={handleClosetLink}>Closet</div>
            <div className={currentPage.includes("Outfits")  ? "nav-link active" : "nav-link"} onClick={handleOutfitLink}>Outfits</div>
            <div className={currentPage.includes("Creator")  ? "nav-link active" : "nav-link"} onClick={handleOutfitCreatorLink}>Outfit Creator Tool</div>
            <div className="nav-link search">         <StyledSearchBar><Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Find my favorite item"
                    className="me-2"
                    aria-label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-success"  onClick={handleSearch}>Search</Button>
            </Form></StyledSearchBar> </div>
            <div className="nav-link settings right" onClick={openModalAdd}><SettingFilled /></div>

            <UserSettings
                closeModalUpdate={closeModalAdd}
                isOpenUpdate={state}
                user={user}
            />


        </StyledNavbar>
    )
}