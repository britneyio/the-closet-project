import React, { useState } from "react";
import {Button, Container, Row, Col, Image, Navbar, Nav} from "react-bootstrap";
import SignupModal from "../signup/SignupModal";
import SigninModal from "../signin/SigninModal";
import styled from 'styled-components';
import './home.css';
import colors from '../../common/colors';
import {HomeStyles, StyledNavbar, PageContainer, Footer} from "../../common/inputs";
import { useNavigate } from "react-router";


const Main = styled(PageContainer)`
  p {
    font-family: sans-serif;
    font-weight:normal;
  }
  position:relative;
  min-height:100vh;



`;

const Jumbotron = styled(Container)`
  background-color: ${colors.highlight4};
  height:45vh;
  min-width:100%;
  width:100vw;
  margin-bottom:3em;
  padding:0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  text-align:center;
  h1 {
    padding-top: 12vh;
  }
  button {
    background-color: ${colors.highlight3};
    border:none;
  }

  button:focus {
    background-color: ${colors.highlight3};
  }
  
  button:hover {
    background-color: ${colors.highlight5};
  }
  
  button:active {
    background-color: ${colors.highlight3};
  }
  
  .btn-primary:active {
    background-color: ${colors.highlight5};

  }
  
  .btn:active {
    background-color: ${colors.highlight5};

  }
  

 

`;

const PageRow = styled(Row)`
  align-items: center;
  text-align: center;
  ${Col} {
    margin: 100px 0;
  }
  h2 {
    font-size:5em;
  }
  p {
    font-size:1.5em;
  }
`;



const PageWrapper = styled(Container)`
  padding-bottom: 2.5rem;
`;
export default function Home() {
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
        <>
      <HomeStyles />
      <Main>
      <div>
           <StyledNavbar expand="lg" sticky="top">
             <Navbar.Brand href="#home">The Closet Project</Navbar.Brand>
             <Navbar.Toggle aria-controls="responsive-navbar-nav" />
             <Navbar.Collapse id="responsive-navbar-nav" style={{backgroundColor:'white'}}>

               <Nav className="me-auto" className="signLink">
                 <Nav.Link className={"nav-link"} onClick={openModalIn}>Sign in</Nav.Link>
                 <Nav.Link className={"nav-link nohover"} onClick={openModalUp}><Button>Sign up</Button></Nav.Link>

               </Nav>
               </Navbar.Collapse>



</StyledNavbar>

        <Jumbotron>
          <h1>Welcome to your Closet</h1>
          <p>We help you organize your closet.</p>
          <p>
            <Button onClick={openModalUp}>Get started</Button>
          </p>
        </Jumbotron>

        <Container>
          <PageRow>
            <Col xs={12} md={6} lg={6}>
              <h2>The Closet</h2>
              <p>
                Experience the convenience of a meticulously organized wardrobe, accessible from any device. Upload and categorize your clothing items effortlessly, creating a curated virtual collection.
                Easily search and locate items by name or clothing type, and utilize our intuitive filtering system to sort based on your preferences. Elevate your style and simplify your life with the Closet Project
                – your go-to solution for a clutter-free, accessible, and stylish wardrobe.
              </p>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Image src={"/static/images/homepage.png"} width={500} height={500} thumbnail/>
            </Col>
          </PageRow>
          <hr/>
          <PageRow>
            <Col xs={12} md={6} lg={6}>
              <Image src={"/static/images/outfitspage.png"} width={500} height={500} thumbnail/>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <h2>The Outfits</h2>
              <p>Our user-friendly interface allows you to effortlessly create, save, and explore your outfits. Looking for a specific type of outfit? Simply filter by clothing type or use personalized names to find exactly what you're looking for. Whether it's a professional look or a casual getup,
                our system is designed to help you put together the perfect outfit in no time.</p>
            </Col>

          </PageRow>
          <hr/>
          <PageRow>
            <Col xs={12} md={6} lg={6}>
              <h2>The Outfit Creator Tool</h2>
              <p>Our user-friendly interface allows you to effortlessly create, save, and explore your outfits. Looking for a specific type of outfit? Simply filter by clothing type or use personalized names to find exactly what you're looking for. Whether it's a professional look or a casual getup,
                our system is designed to help you put together the perfect outfit in no time.</p>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Image src={"/static/images/closetpage.png"} width={500} height={500} thumbnail/>
            </Col>
          </PageRow>

          <Footer>
            <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
          </Footer>
        </Container>



        
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



</Main>


</>
    
    );
  }


