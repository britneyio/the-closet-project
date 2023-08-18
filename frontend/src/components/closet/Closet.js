import React, { useState, useEffect } from "react";
import { Form, Navbar, Nav, Pagination, Button } from "react-bootstrap";
import { connect, useDispatch, useSelector} from 'react-redux';
import { signout } from '../../middleware/SigninActions';
import ClothingList from "../clothing/ClothingList";
import AddClothingItem from "../clothing/AddClothingItem";
import withRouter from "../../withRouter";
import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import { getClothing } from '../../middleware/ClothingActions';
import './closet.css';
import {SettingFilled} from '@ant-design/icons';
import {StyledNavbarComponent, FlexWrapper, HomeStyles, PageContainer} from '../../common/inputs';
import colors from "../../common/colors";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const {user}= useSelector(selectAuth);
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
      <FlexWrapper>
         <HomeStyles />
         <PageContainer> 
    <StyledNavbarComponent user={user} currentPage={"Closet"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>

            <AddClothingItem
                closeModalAdd={closeModalAdd}
                isOpenAdd={state}
                types={typesData}
                />
        <TypeList types={types.length > 0 ? types : typesData.types} isClicked={typeIsClicked} />
        <Button style={{margin: "25px 0 0 250px ", backgroundColor:colors.highlight1, border:"none", color:"black"}}onClick={openModalAdd}>Add Item</Button>

          <ClothingList clothing={clothing.length > 0 ? clothing : clothingData.clothing } />
          </PageContainer>
      </FlexWrapper>
    );
  }