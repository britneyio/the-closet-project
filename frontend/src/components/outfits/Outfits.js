import React, { useState, useEffect } from "react";
import { Form, Navbar, Nav, Pagination, Button } from "react-bootstrap";
import { connect, useDispatch, useSelector} from 'react-redux';
import ClothingList from "../clothing/ClothingList";
import AddClothingItem from "../clothing/AddClothingItem";
import withRouter from "../../withRouter";
import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import {SettingFilled} from '@ant-design/icons';
import {
    StyledModal,
    StyledPagination,
    StyledNavbar,
    StyledSearchBar,
    FlexWrapper,
    HomeStyles,
    PageContainer,
    StyledNavbarComponent
} from '../../common/inputs';
import { useNavigate } from "react-router";
import { getOutfits } from "../../middleware/OutfitActions";
import OutfitList from "./OutfitList";

const selectTypes = state => state.types;
const selectAuth = state => state.auth;
const selectOutfits = state => state.outfits; 
function Outfits(props) {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const types = useSelector(selectTypes);
  const [search, setSearch] = useState("");
  const [isSearching, setSearching] = useState(false);
  const navigate = useNavigate();
  const {user}= useSelector(selectAuth);
  const {outfits} = useSelector(selectOutfits);
  const [fit, setOutfits] = useState([]);

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
      <FlexWrapper>
         <HomeStyles />
         <PageContainer>
             <StyledNavbarComponent user={user} currentPage={"Outfits"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>



             {state ?
            <AddClothingItem
                closeModalAdd={closeModalAdd}
                isOpenAdd={state}
                types={types}
                /> : null }
        <TypeList types={types.types} isClicked={typeIsClicked} />
          <OutfitList outfits={fit.length > 0 ? fit : outfits} />
          </PageContainer>
{/*<StyledPagination>*/}
{/*          <Pagination size="sm">*/}
{/*      <Pagination.First />*/}
{/*      <Pagination.Prev />*/}
{/*      <Pagination.Item active>{1}</Pagination.Item>*/}
{/*      <Pagination.Ellipsis />*/}

{/*      <Pagination.Item>{3}</Pagination.Item>*/}
{/*  */}

{/*      <Pagination.Ellipsis />*/}
{/*      <Pagination.Item>{5}</Pagination.Item>*/}
{/*      <Pagination.Next />*/}
{/*      <Pagination.Last />*/}
{/*    </Pagination> */}
{/*    </StyledPagination>*/}
          
      </FlexWrapper>
    );
  }



export default (withRouter(Outfits));