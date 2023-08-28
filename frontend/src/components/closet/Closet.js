import React, { useState, useEffect } from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import { useDispatch, useSelector} from 'react-redux';
import { signout } from '../../middleware/SigninActions';
import ClothingList from "../clothing/ClothingList";
import AddClothingItem from "../clothing/AddClothingItem";
import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import { getClothing } from '../../middleware/ClothingActions';
import './closet.css';
import {StyledNavbarComponent, FlexWrapper, HomeStyles, PageContainer, Footer} from '../../common/inputs';
import colors from "../../common/colors";
import styled from "styled-components";

const ClosetContainer = styled(Container)`
    position:relative;
    display: inline-block;

  
`;
const selectClothing = state => state.clothing;
const selectTypes = state => state.types;
const selectAuth = state => state.auth;

export default function Closet(props) {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const [clothing, setClothing] = useState([]);
  const [types, setTypes] = useState([]);
  const typesData = useSelector(selectTypes);
  const clothingData = useSelector(selectClothing);
  const [search, setSearch] = useState("");
  const [isSearching, setSearching] = useState(false);
  const {user}= useSelector(selectAuth);
  const [navState, setNavState] = useState(true);
  const onSignout = () => {
    dispatch(signout());
  };

  useEffect(() => {
    init();
 }, []);

 const init = async () => {
  dispatch(getClothing());
  dispatch(getTypes());

 }

  const typeIsClicked = (itemName) => {
    if (itemName === "all") {
      setClothing(clothingData.clothing);
    } else {
    setClothing(clothingData.clothing.filter(n => n.ctype.toString() === itemName.toString()));
    }
    
  };


  const handleSearch = (e) => {
    setClothing(clothingData.clothing.filter(c => c.name.includes(search)
            || c.ctype.includes(search)))
    
  }

const openModalAdd = () => setState(true);
const closeModalAdd = () => setState(false);

    return (
      <>
         <HomeStyles />
    <StyledNavbarComponent user={user} currentPage={"Closet"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>

        <Row>
            <Col lg={2} md={2}>
        <TypeList types={types.length > 0 ? types : typesData.types} isClicked={typeIsClicked}/>
            </Col>
             <AddClothingItem
                 closeModalAdd={closeModalAdd}
                 isOpenAdd={state}
                 types={typesData}
             />
        {/*<Button style={{margin: "25px 0 0 250px ", backgroundColor:colors.highlight1, border:"none", color:"black"}}onClick={openModalAdd}>Add Item</Button>*/}
    <Col lg={10} md={10}>
             <ClothingList clothing={clothing.length > 0 ? clothing : clothingData.clothing } navState={navState}/>
    </Col>
        </Row>
          <Footer>
              <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
          </Footer>
      </>
    );
  }