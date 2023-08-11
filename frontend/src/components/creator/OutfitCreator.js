import React, {useEffect,useState} from 'react';
import { connect, useDispatch, useSelector} from 'react-redux';
import { getOutfits } from '../../middleware/OutfitActions';
import { Form, Button } from "react-bootstrap";
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
import styled from 'styled-components';
import ClothingCarousel from '../carousel/ClothingCarousel';
import { getClothing } from '../../middleware/ClothingActions';
import colors from '../../common/colors';
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
`;

const OverLayTop = styled.div`
  width: 50%;
  height: 50%;
  opacity: 75%;
  background-image:  url(${props => props.image});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left:125px;
`;

const OverLayBottom = styled.div`
  width: 50%;
  height: 50%;
  opacity: 75%;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left:125px;
`;

const StyledImage = styled.div`
  margin:0 auto;
  width: 500px;
  height: 100%;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
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
    const [selected, setSelected] = useState([]);

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

      const imageIsClicked = (image) => {
          let current = selected;
          if (!current.includes(image)) {
            current.push(image);
            setSelected(current);
          } else {
            alert("already selected");
          }

          console.log(selected)

      }
    

    
      const handleSearch = (e) => {
        // setClothing(clothingData.clothing.filter(c => c.name.includes(search)
        //         || c.ctype.includes(search)))
        
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
                 <StyledNavbarComponent user={user.username} currentPage={"Outfit Creator Tool"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>


            <TypeList isClicked={typeIsClicked} /> 
            {/* <Button style={{marginLeft: "300px"}}onClick={openModalAdd}>Add Item</Button> */}
             <ClothingCarousel clothing={clothing.length > 0 ? clothing : clothingData.clothing } isClicked={imageIsClicked}/>
<StyledSpace>
{/* <h2>Overlay image</h2> */}
<StyledImage image={"#"}>
  <OverLayTop image={"#"} />
  <OverLayBottom image={"#"} />
  </StyledImage>
  </StyledSpace>

              </PageContainer>
              
          </FlexWrapper>
        );
      }
    
      const mapStateToProps = state => ({
        auth: state.auth
      });
      
      export default connect(mapStateToProps)(withRouter(OutfitCreator));

