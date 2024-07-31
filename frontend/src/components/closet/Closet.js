import React, { useState, useEffect } from "react";
import {Button, Col, Row} from "react-bootstrap";
import { useDispatch, useSelector} from 'react-redux';
import ClothingList from "../clothing/ClothingList";
import TypeList from "../types/TypeList";
import { getTypes } from "../../middleware/TypeActions";
import { getClothing } from '../../middleware/ClothingActions';
import './closet.css';
import {
    StyledNavbarComponent,
    HomeStyles,
    Footer,
} from '../../common/inputs';
import colors from "../../common/colors";
import styled from "styled-components";

const FooterRow = styled(Row)`
  ul {
    list-style:none;
  }
  
  li {
    display:inline;

  }
  
  button, .btn, .btn-primary {
    border:none !important;
    text-decoration: none;
    background-color: ${colors.highlight1};
    }

    button:focus,  .btn-primary:focus, .active:focus, .btn:focus {
      background-color: ${colors.highlight3};
    }
  

    button:hover, .btn-primary:hover, .active:hover, .btn:hover{
      background-color: ${colors.highlight3};
    }

    button:active, .btn-primary:active, .active:active, .btn:active {
      background-color: ${colors.highlight3};
    }

 

   





  }

  
`;
const selectClothing = state => state.clothing;
const selectTypes = state => state.types;
const selectAuth = state => state.auth;

export default function Closet(props) {
  const dispatch = useDispatch();
  const [clothing, setClothing] = useState([]);
  const {types} = useSelector(selectTypes);
  const clothingData = useSelector(selectClothing);
  const [search, setSearch] = useState("");
  const {user}= useSelector(selectAuth);
  const {length} = useSelector(selectClothing);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(length / itemsPerPage);
  const pages = [];
  for(let i=1 ; i<=totalPages; i++){
        pages.push(i);
    }



    useEffect(() => {
        dispatch(getClothing(currentPage));
        },
        [currentPage]);

    useEffect(() => {
        dispatch(getTypes());
    }, []);

    const handlePageChange = (i) => {
        if (currentPage > 1 && i === -1) {
            setCurrentPage(currentPage - 1)
        }
        if (currentPage < totalPages && i === 1){
            setCurrentPage(currentPage + 1)
        }
        else {
            setCurrentPage(i);
        }
    }

    const pageNumbers = pages.map(page => {
            if(page <= 20  && page > 0) {
                return(
                    <li><Button key={page}  onClick={() => handlePageChange(page)}
                        className={currentPage===page ? 'active' : 'btn-primary'}>
                        {page}</Button>
                    </li>
                );
            }else{
                return null;
            }
        }

    );



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



    return (
      <>
         <HomeStyles />
    <StyledNavbarComponent user={user} currentPage={"Closet"} search={search} setSearch={setSearch} handleSearch={handleSearch}/>

        <Row>
            <Col lg={2} md={2}>
        <TypeList types={types} isClicked={typeIsClicked}/>
            </Col>
    <Col lg={10} md={10}>
             <ClothingList clothing={clothing.length > 0 ? clothing : clothingData.clothing } types={types}/>
    </Col>
        </Row>
          <FooterRow>


              <div style={{display:'flex', justifyContent:'center'}}>
              <Button onClick={() => handlePageChange(-1)}>Previous</Button>
                 <ul> {pageNumbers}</ul>
              <Button onClick={() => handlePageChange(1)}>Next</Button>
              </div>
          <Footer>
              <p>© 2023 The Closet Project, Inc. · <a href={'#'}> Privacy</a> · <a href={'#'}>Terms</a></p>
          </Footer>
          </FooterRow>
      </>
    );
  }