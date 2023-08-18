import React, {useEffect,useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import {

    FlexWrapper,
    HomeStyles,
    PageContainer,
    StyledNavbarComponent
} from '../../common/inputs';
import { useNavigate } from "react-router";
import styled from 'styled-components';
import ClothingCarousel from '../carousel/ClothingCarousel';
import { getClothing } from '../../middleware/ClothingActions';
import colors from '../../common/colors';
import CreatorSpace from "./CreatorSpace";






const selectClothing = state => state.clothing;
const selectTypes = state => state.types;
const selectAuth = state => state.auth;


export default function OutfitCreator() {
    const [state, setState] = useState(false);
    const dispatch = useDispatch();
    const [clothing, setClothing] = useState([]);
    const types = useSelector(selectTypes);
    const clothingData = useSelector(selectClothing);
    const [search, setSearch] = useState("");
    const [isSearching, setSearching] = useState(false);
    const [selected, setSelected] = useState([]);

    const {user}= useSelector(selectAuth);

    useEffect(() => {
        dispatch(getTypes());
        dispatch(getClothing());
     }, []);




     const typeIsClicked = (itemName) => {
        if (itemName === "all") {
          setClothing(clothingData.clothing);
        } else {
        setClothing(clothingData.clothing.filter(n => n.ctype.toString() === itemName.toString()));
        }
        
      };

      const imageIsClicked = (item) => {
          const current = selected;
          if (current.includes(item)) {
              let i = current.indexOf(item)
              current.splice(i,1)
              setSelected(current);

          } else {
              current.push(item)
              setSelected(current);

          }
      }


      const handleSearch = (e) => {
        // setClothing(clothingData.clothing.filter(c => c.name.includes(search)
        //         || c.ctype.includes(search)))
        
      }

    
        return (
          <FlexWrapper>
             <HomeStyles />
             <PageContainer>
                 <StyledNavbarComponent user={user} currentPage={"Outfit Creator Tool"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>


                 <TypeList types={types.types} isClicked={typeIsClicked} />
            {/* <Button style={{marginLeft: "300px"}}onClick={openModalAdd}>Add Item</Button> */}
             <ClothingCarousel clothing={clothing.length > 0 ? clothing : clothingData.clothing } isClicked={imageIsClicked}/>
                 <CreatorSpace items={selected} />
              </PageContainer>
              
          </FlexWrapper>
        );
      }
    


