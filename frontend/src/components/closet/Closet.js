import React, { useState, useEffect } from "react";
import { Form, Navbar, Nav, Pagination, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector} from 'react-redux';
import { signout } from '../signin/SigninActions';
import ClothingList from "../clothing/ClothingList";
import AddClothingItem from "../clothing/AddClothingItem";
import withRouter from "../../withRouter";
import TypeList from "../types/TypeList";
import { getTypes } from "../types/TypeActions";
import { getClothing } from '../clothing/ClothingActions';
import './closet.css';
import styled, {createGlobalStyle} from 'styled-components';
import colors from '../../common/colors';
import {SettingOutlined} from '@ant-design/icons';




const StyledNavbar = styled(Navbar)`
  background-color: ${colors.highlight2};
  button {
    background-color: ${colors.highlight1};
    border: none;
  }

   .nav-link:hover {
    background-color:${colors.highlight3};
  }

  .navbar-brand {
    margin-left: 20px;
  }

  button:hover {
    background-color:${colors.highlight3};
  }

  #brand {}
`;

const HomeContainer = createGlobalStyle`
  body {
  background-color:${colors.background1};
  overflow-x:hidden;
  }
  
`;

const selectClothing = state => state.clothing; 
const selectTypes = state => state.types;

function Closet(props) {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();

  const typesData = useSelector(selectTypes);
  const clothingData = useSelector(selectClothing);

  useEffect(() => {
  dispatch(getClothing());
},[]);

useEffect(() => {
  dispatch(getTypes());
},[]);

  const [clothing, setClothing] = useState(clothingData.clothing);
  const  types = typesData.types;

  const onSignout = () => {
    props.signout();
  };
  




  const typeIsClicked = (itemName) => {
    if(itemName.toString().toLowerCase() === "all") {
      setClothing(clothingData.clothing);
    }
    setClothing(clothingData.clothing.filter(n => n.ctype.toString() === itemName.toString()));
  };
  
  
const openModalAdd = () => setState(true);
const closeModalAdd = () => setState(false);

    const { user } = props.auth;
    return (
      <>
         <HomeContainer />
      <StyledNavbar expand="lg" sticky="top">
        <Navbar.Brand id={"brand"} href="/">{user.username}'s Closet</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link onClick={openModalAdd}>Add Item</Nav.Link>
            <Nav.Link href="/outfits">Outfits</Nav.Link>
            
            </Nav>
            <Nav className="ma-auto">
            <Nav.Link ><SettingOutlined /></Nav.Link>
            <Nav.Link onClick={onSignout}>Sign out</Nav.Link>

          </Nav>
        </Navbar.Collapse>

    </StyledNavbar>

     

        {state ? 
            <AddClothingItem
                closeModalAdd={closeModalAdd}
                isOpenAdd={state}
                types={types}
                /> : null }
        <TypeList types={types} isClicked={typeIsClicked} />
        <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <ClothingList clothing={clothing} />

          <Pagination size="sm">
      <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{3}</Pagination.Item>
  

      <Pagination.Ellipsis />
      <Pagination.Item>{5}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination> 
          
      </>
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