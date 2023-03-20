import React, {useEffect,useState} from 'react';
import { connect, useDispatch, useSelector} from 'react-redux';
import { getOutfits } from './OutfitActions';
import { Form, Navbar, Nav, Pagination, Button } from "react-bootstrap";
import { signout } from '../signin/SigninActions';
import withRouter from "../../withRouter";
import TypeList from "../types/TypeList";
import { getTypes } from "../types/TypeActions";
import {SettingFilled} from '@ant-design/icons';
import {StyledModal, StyledPagination, StyledNavbar, StyledSearchBar, FlexWrapper, HomeStyles, PageContainer} from '../../common/inputs';
import { useNavigate } from "react-router";
import styled from 'styled-components';
import ClothingCarousel from '../clothing/ClothingCarousel';
import { getClothing } from '../clothing/ClothingActions';

const selectOutfits = state => state.outfits; 
const selectClothing = state => state.clothing; 
const selectTypes = state => state.types;

const StyledSpace = styled.div`
   background-color:white;
   position:relative;
    top:0;
    bottom: 0;
    left: 100px;
    right: 0;
    width:75%;
    height:100vh;
    margin: 0 auto;
    .overlay-top {
        width: 50%;
        height: 50%;
        opacity: 75%;
        background: url("https://img1.g-star.com/product/c_fill,f_auto,h_630,q_80/v1614677580/D08512-8415-110-M05/g-star-raw-holorn-t-shirt-white.jpg");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        margin-left:125px;
    }
    .overlay-bot {
        width: 50%;
        height: 50%;
        opacity: 75%;
        background: url("https://upload.wikimedia.org/wikipedia/commons/5/5a/Jeans.jpg");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        margin-left:125px;
    }
    .image {
        margin:0 auto;
        width: 500px;
        height: 100%;
        margin-bottom: 20px;
        background-image: url("https://www.tornado-studios.com/sites/default/files/styles/slider_full/public/products/1092/gallery/wooden_mannequin_01_rig_thumbnail_square0000.jpg?itok=V8I41IPQ");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }
`;

const StyledCarousel = styled.div`
    width:75%;
    margin:0 auto;
`;

 function OutfitCreator(props) {
    const [state, setState] = useState(false);
    const dispatch = useDispatch();
    const [clothing, setClothing] = useState([]);
    const types = useSelector(selectTypes);
    const clothingData = useSelector(selectClothing);
    const [search, setSearch] = useState("");
    const [isSearching, setSearching] = useState(false);
    const outfits = useSelector(selectOutfits);
    const navigate = useNavigate();


    useEffect(() => {
        init();
     }, []);
    
     const init = async () => {
      dispatch(getOutfits());
      dispatch(getTypes());
      dispatch(getClothing());


     
     }

     const typeIsClicked = (itemName) => {
        if (itemName === "all") {
          setClothing(clothingData.clothing);
        } else {
        setClothing(clothingData.clothing.filter(n => n.ctype.toString() === itemName.toString()));
        }
        
      };
    
      const onSignout = () => {
        props.signout();
      };
    
      const handleSearch = (e) => {
        setClothing(clothingData.clothing.filter(c => c.name.includes(search)
                || c.ctype.includes(search)))
        
      }
      
      
    const openModalAdd = () => setState(true);
    const closeModalAdd = () => setState(false);

    const handleClosetLink = () => {
        navigate("/closet");
      };

      const handleOutfitLink = () => {
        navigate("/outfits");
      };

    
        const { user } = props.auth;
        return (
          <FlexWrapper>
             <HomeStyles />
             <PageContainer> 
             <StyledNavbar expand="lg" sticky="top">
        <div className="nav-header">Outfit Creator Tool</div>
        <div className="nav-link" onClick={handleClosetLink}>Closet</div>
        <div className="nav-link" onClick={handleOutfitLink}>Outfits</div>
        {/* <div className="nav-link">Home</div> */}
        <div className="nav-link search">         <StyledSearchBar><Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Find my favorite item"
              className="me-2"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-success"  onClick={handleSearch}>Search</Button>
          </Form></StyledSearchBar> </div>
        <div className="nav-link settings right"><SettingFilled /></div>


    </StyledNavbar>
    
         
{/*     
            {state ? 
                <AddClothingItem
                    closeModalAdd={closeModalAdd}
                    isOpenAdd={state}
                    types={types}
                    /> : null } */}
            <TypeList isClicked={typeIsClicked} /> 
            <Button style={{marginLeft: "300px"}}onClick={openModalAdd}>Add Item</Button>
             <StyledCarousel> <ClothingCarousel clothing={clothing.length > 0 ? clothing : clothingData.clothing } /></StyledCarousel>
<StyledSpace>
{/* <h2>Overlay image</h2> */}
<div class="image">
  <div class="overlay-top"></div>
  <div class="overlay-bot"></div>
  </div>
  </StyledSpace>

              </PageContainer> 

    <StyledPagination>
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
        </StyledPagination>
              
          </FlexWrapper>
        );
      }
    
      const mapStateToProps = state => ({
        auth: state.auth
      });
      
      export default connect(mapStateToProps, { signout })(withRouter(OutfitCreator));

