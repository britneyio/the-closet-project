import React, { Component, useState } from "react";
import {Button, Nav, Navbar, Container, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignupModal from "./signup/SignupModal";
import SigninModal from "./signin/SigninModal";
import styled, { createGlobalStyle } from 'styled-components';
import './home.css';
import colors from '../common/colors';
import { FlexWrapper, HomeStyles, StyledNavbar, PageContainer } from "../common/inputs";
import { SettingFilled } from "@ant-design/icons";
import { useNavigate } from "react-router";
import withRouter from "../withRouter";

const StyledContainer = styled(Container)`
  height:100vh;
  overflow-y:hidden;
`;
function Home() {
  const [signInState, setSignInModal] = useState(false);
  const [signUpState, setSignUpModal] = useState(false);

    const openModalIn = () => setSignInModal(true);
    const closeModalIn = () => setSignInModal(false);
    const openModalUp = () => setSignUpModal(true);
    const closeModalUp = () => setSignUpModal(false);

    const navigate = useNavigate();


    const handleClosetLink = () => {
      navigate("/closet");
    };

    const handleOutfitLink = () => {
      navigate("/outfits");
    };
    const handleCreatorLink = () => {
      navigate("/outfit-creator");
    };


    return (
      <FlexWrapper>
      <HomeStyles />
      <PageContainer> 
      <div>
           <StyledNavbar expand="lg" sticky="top">
        <div className="nav-header">The Closet Project</div>
        <div className="nav-link" onClick={handleClosetLink}>Closet</div>
        <div className="nav-link" onClick={handleOutfitLink}>Outfits</div>
        <div className="nav-link" onClick={handleCreatorLink}>Outfit Creator Tool</div>
        <div className="signLink">
        <div className="nav-link" onClick={openModalIn}>Sign in</div>
        <div className="nav-link nohover" onClick={openModalUp}><Button>Sign up</Button></div>
        </div>


</StyledNavbar>
    <StyledContainer >
   
        <img
          style={{height:"100%", width:"100%", overflow:"hidden"}}
          src="https://miro.medium.com/v2/resize:fit:1400/1*GKfCRRWwXkrAVNJ4GFET8Q.png"
          alt="First slide"
        />
  
  
      </StyledContainer>
    
        
            {signInState ? 
            <SigninModal
                closeModalIn={closeModalIn}
                isOpenIn={signInState}
                /> : null }
               
            {signUpState ? 
            <SignupModal
                closeModalUp={closeModalUp}
                isOpenUp={signUpState}
                /> : null }
                </div>


</PageContainer> 


</FlexWrapper>
                
    
    );
  }


export default withRouter(Home);