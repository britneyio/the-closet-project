import React, { Component, useState } from "react";
import {Button, Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignupModal from "./signup/SignupModal";
import SigninModal from "./signin/SigninModal";
import styled from 'styled-components';
import './home.css';



function Home(props) {
  const [signInState, setSignInModal] = useState(false);
  const [signUpState, setSignUpModal] = useState(false);

    const openModalIn = () => setSignInModal(true);
    const closeModalIn = () => setSignInModal(false);
    const openModalUp = () => setSignUpModal(true);
    const closeModalUp = () => setSignUpModal(false);

    return (
      <div>
      <Navbar variant="color" expand="lg">
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

    </Navbar>
    <Container>
      <h1>Your closet online</h1>
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