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
import {
    StyledNavbarComponent,
    FlexWrapper,
    HomeStyles,
    PageContainer,
    Footer,
    StyledPagination
} from '../../common/inputs';
import colors from "../../common/colors";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

const FooterRow = styled(Row)`
  .container {
    display: flex;
    list-style: none;
  }

  .page {
    padding: 10px;
    border: 1px solid #dcdcdc;
    border-radius: 6px;
    margin-right: 10px;
    cursor: pointer;
  }

  .disabled {
    cursor: not-allowed;

  }

  .active {
    border: 2px solid #000;
    font-weight: bold;
  }

  .previous {
    padding: 10px;
    border-radius: 6px;
    margin-right: 10px;
    cursor: pointer;
  }

  .break {
    padding: 10px;
  }

  .next {
    padding: 10px;
    border-radius: 6px;
    margin-right: 10px;
    cursor: pointer;
  }

  
`;
const selectClothing = state => state.clothing;
const selectTypes = state => state.types;
const selectAuth = state => state.auth;

export default function Closet(props) {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const [clothing, setClothing] = useState([]);
  const {types} = useSelector(selectTypes);
  const clothingData = useSelector(selectClothing);
  const [search, setSearch] = useState("");
  const {user}= useSelector(selectAuth);
  const {length} = useSelector(selectClothing);
    const [hits, setHits] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoaded, setisLoaded] = useState(false);
    const [currentPage, setcurrentPage] = useState(0);
    const [itemOffset, setItemOffset ] = useState(1);
    const itemsPerPage = 2;
    console.log("offset", itemOffset)
    console.log("pagecount", pageCount)

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        handleFetch();
        dispatch(getTypes());

    }


    const handleFetch = () => {
        dispatch(getClothing(itemOffset));
        setPageCount(Math.ceil(length / itemsPerPage));
    }

    const handlePageChange = (e) => {
        const newOffset = (e.selected);
        handleFetch();

        setItemOffset(newOffset);
        console.log("Selected", e);
    };





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
        <TypeList types={types} isClicked={typeIsClicked}/>
            </Col>
             <AddClothingItem
                 closeModalAdd={closeModalAdd}
                 isOpenAdd={state}
                 types={types}
             />
        {/*<Button style={{margin: "25px 0 0 250px ", backgroundColor:colors.highlight1, border:"none", color:"black"}}onClick={openModalAdd}>Add Item</Button>*/}
    <Col lg={10} md={10}>
             <ClothingList clothing={clothing.length > 0 ? clothing : clothingData.clothing }/>
    </Col>
        </Row>
          <FooterRow>
              <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={5}
                  pageCount={3}
                  previousLabel="< previous"
                  containerClassName={'container'}
                  previousLinkClassName={'page'}
                  breakClassName={'page'}
                  nextLinkClassName={'page'}
                  pageClassName={'page'}
                  disabledClassName={'disabled'}
                  activeClassName={'active'}
              />

          <Footer>
              <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
          </Footer>
          </FooterRow>
      </>
    );
  }