import React, { Component, useState } from "react";
import {Button, Nav, Navbar, Container, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignupModal from "./signup/SignupModal";
import SigninModal from "./signin/SigninModal";
import styled, { createGlobalStyle } from 'styled-components';
import './home.css';
import colors from '../common/colors';

const StyledNavBar = styled(Navbar)`
  background-color:${colors.highlight2};
`;

const HomeContainer = createGlobalStyle`
  body {
  background-color:${colors.background1};
  }
`;
function Home() {
  const [signInState, setSignInModal] = useState(false);
  const [signUpState, setSignUpModal] = useState(false);

    const openModalIn = () => setSignInModal(true);
    const closeModalIn = () => setSignInModal(false);
    const openModalUp = () => setSignUpModal(true);
    const closeModalUp = () => setSignUpModal(false);

    return (
   
      <div>
           <HomeContainer />
      <StyledNavBar variant="color" expand="lg">
      <Container>
        <Navbar.Brand href="/">The Closet Project</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        
          <Nav className="me-auto">
            <Nav.Link href="/closet">Closet</Nav.Link>
            <Nav.Link href="#">How it Works</Nav.Link>
            </Nav>
            <Nav>
            <Nav.Link className="signLink" onClick={openModalIn}>Sign in</Nav.Link>
            <Nav.Link className="signLink" onClick={openModalUp}><Button>Sign up</Button></Nav.Link>

          </Nav>
        </Navbar.Collapse>
        </Container>

    </StyledNavBar>
    <Container>
      <h1>Your closet online</h1>
      <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="http://127.0.0.1:8000/media/images/cobalt-blue-t-shirt_IFyUHp8.jpg"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="c11d164de692594acf53c9a855093139.jpg"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
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
                
    
    );
  }


export default Home;