import React, {useEffect,useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import {

    FlexWrapper, Footer,
    HomeStyles,
    PageContainer,
    StyledNavbarComponent
} from '../../common/inputs';
import { useParams} from "react-router";
import ClothingCarousel from '../carousel/ClothingCarousel';
import { getClothing } from '../../middleware/ClothingActions';
import CreatorSpace from "./CreatorSpace";
import AddOutfit from "../outfits/AddOutfit";
import UpdateOutfit from "../outfits/UpdateOutfit";
import {getOutfitByID, getOutfits} from "../../middleware/OutfitActions";
import {Col, Row} from "react-bootstrap";
import AddClothingItem from "../clothing/AddClothingItem";
import ClothingList from "../clothing/ClothingList";






const selectClothing = state => state.clothing;
const selectTypes = state => state.types;
const selectAuth = state => state.auth;

const selectOutfits = state => state.outfits;


export default function OutfitCreator() {
    const [state, setState] = useState(false);
    const dispatch = useDispatch();
    const [clothing, setClothing] = useState([]);
    const {types} = useSelector(selectTypes);
    const clothingData = useSelector(selectClothing);
    const [search, setSearch] = useState("");
    const [isSearching, setSearching] = useState(false);
    const [selected, setSelected] = useState([]);
    const {user}= useSelector(selectAuth);
    const [navState, setNavState] = useState(true);
    const { id }  = useParams();
    const {outfits} = useSelector(selectOutfits);


    useEffect(() => {
        dispatch(getTypes());
        dispatch(getClothing());
        if (window.location.pathname.includes('edit')) {
            dispatch(getOutfitByID(id));
        }
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
              setSelected([...current]);

          } else {
              current.push(item)
              setSelected([...current]);

          }
      }


      const handleSearch = (e) => {
        // setClothing(clothingData.clothing.filter(c => c.name.includes(search)
        //         || c.ctype.includes(search)))
        
      }

    if (window.location.pathname.includes('edit')) {
        return (
            <>
                <HomeStyles />
                <StyledNavbarComponent user={user} currentPage={"Outfit Creator Tool"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>

                <Row>
                    <Col lg={2} md={2}>
                        <TypeList types={types} isClicked={typeIsClicked}/>
                    </Col>
                    {/*<Button style={{margin: "25px 0 0 250px ", backgroundColor:colors.highlight1, border:"none", color:"black"}}onClick={openModalAdd}>Add Item</Button>*/}
                    <Col lg={10} md={10}>

                        <ClothingCarousel clothing={clothing.length > 0 ? clothing : clothingData.clothing } isClicked={imageIsClicked}/>
                        <UpdateOutfit outfit={outfits}/>
                        <CreatorSpace items={selected} />
                    </Col>
                </Row>
                <Footer>
                    <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
                </Footer>
            </>);

    }
        return (
            <>
                <HomeStyles />
                <StyledNavbarComponent user={user} currentPage={"Outfit Creator Tool"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>

                <Row>
                    <Col lg={2} md={2}>
                        <TypeList types={types} isClicked={typeIsClicked}/>
                    </Col>
                    {/*<Button style={{margin: "25px 0 0 250px ", backgroundColor:colors.highlight1, border:"none", color:"black"}}onClick={openModalAdd}>Add Item</Button>*/}
                    <Col lg={10} md={10}>

                        <ClothingCarousel clothing={clothing.length > 0 ? clothing : clothingData.clothing } isClicked={imageIsClicked}/>
                        <AddOutfit items={selected}/>
                        <CreatorSpace items={selected} />
                    </Col>
                </Row>
                <Footer>
                    <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
                </Footer>
            </>

        );
      }
    


