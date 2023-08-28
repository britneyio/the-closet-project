import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from 'react-redux';
import AddClothingItem from "../clothing/AddClothingItem";
import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import {
    FlexWrapper, Footer,
    HomeStyles,
    PageContainer,
    StyledNavbarComponent
} from '../../common/inputs';
import { useNavigate } from "react-router";
import { getOutfits } from "../../middleware/OutfitActions";
import OutfitList from "./OutfitList";
import {Col, Row} from "react-bootstrap";
import ClothingList from "../clothing/ClothingList";

const selectTypes = state => state.types;
const selectAuth = state => state.auth;
const selectOutfits = state => state.outfits; 
export default function Outfits(props) {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const {types} = useSelector(selectTypes);
  const [search, setSearch] = useState("");
  const [isSearching, setSearching] = useState(false);
  const navigate = useNavigate();
  const {user}= useSelector(selectAuth);
  const {outfits} = useSelector(selectOutfits);
  const [fit, setOutfits] = useState([]);
  const [navState, setNavState] = useState(true);


    const onSignout = () => {
    props.signout();
  };

  useEffect(() => {
    init();
 }, []);

 const init = async () => {
    dispatch(getOutfits());
    dispatch(getTypes());
 
 }

  const typeIsClicked = (itemName) => {
    if (itemName === "all") {
        setOutfits(outfits);
    } else {
    // setOutfits(clothingData.clothing.filter(n => n.ctype.toString() === itemName.toString()));
    }
    
  };


  const handleSearch = (e) => {
    setOutfits(outfits.filter(o => o.name.includes(search)
      || o.items.filter(c => c.name.includes(search)
            || c.ctype.includes(search))))
    
  }
  
  
const openModalAdd = () => setState(true);
const closeModalAdd = () => setState(false);

const handleClosettLink = () => {
  navigate("/closet");
};
const handleAddOutfit = () => {
    navigate("/outfit-creator");
}

    return (
        <>
            <HomeStyles />
            <StyledNavbarComponent user={user} currentPage={"Outfits"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>

            <Row>
                <Col lg={2} md={2}>
                    <TypeList types={types} isClicked={typeIsClicked}/>
                </Col>

                <Col lg={10} md={10}>
                    <OutfitList outfits={fit.length > 0 ? fit : outfits} />
                </Col>
            </Row>
            <Footer>
                <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
            </Footer>
        </>


    );
  }



