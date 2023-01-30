import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signout } from '../signin/SigninActions';
import ClothingList from "../clothing/ClothingList";
import AddClothingItem from "../clothing/AddClothingItem";
import withRouter from "../../withRouter";
import TypeList from "../types/TypeList";
import { getTypes } from "../types/TypeActions";
import { getClothing } from '../clothing/ClothingActions';
import './closet.css';
import styled from 'styled-components';

const StyledTypeList = styled.div`
height: 100%;
width: 300px;
overflow-x:auto;
display: flex;
flex-direction: row;
position: fixed;
  & div > a {
    width:100px;
    color:red;
  }

  &  {
    width:200px;
    background-color:#a9a9a9;
  }

  & .nav-item {
    width: 100%;
  }

  #sidebar {
    width: 100%;
  }

  .nav-item:hover  {
    background-color:green;
    border:1px white solid;
  }
  .nav-item a {
    border: none; 
  }

`;

const StyledClothingList = styled.div`
  position:relative;
  top:75px;
  left:150px;
  display:flex;
  flex-wrap: wrap;
  width:100%;
`;
function Closet(props) {
  const [state, setState] = useState(false);

  const onSignout = () => {
    props.signout();
  };

  useEffect(() => {
    props.getTypes();
    props.getClothing();
})

  const types = props.types;
  const clothing = props.clothing;
  
const openModalAdd = () => setState(true);
const closeModalAdd = () => setState(false);

    const { user } = props.auth;
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Brand href="/">Clothing</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              User: <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link onClick={onSignout}>Sign out</Nav.Link>
            <Button onClick={openModalAdd}>Add item</Button>

          </Navbar.Collapse>
        </Navbar>
        {state ? 
            <AddClothingItem
                closeModalAdd={closeModalAdd}
                isOpenAdd={state}
                types={types}
                /> : null }
        <StyledTypeList>
        <TypeList types={types} />
        </StyledTypeList>   
        <StyledClothingList>     
          <ClothingList clothing={clothing} />
          </StyledClothingList>
          
      </div>
    );
  }


Closet.propTypes = {
  signout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getTypes: PropTypes.func.isRequired,
  getClothing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { signout, getTypes, getClothing })(withRouter(Closet));