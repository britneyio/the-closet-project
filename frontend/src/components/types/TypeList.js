import React, { useState } from 'react';
import Type  from './Type';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav,  } from 'react-bootstrap';
import {FileAddOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import colors from '../../common/colors';
import AddType from './AddType';

const StyledNav = styled(Nav)`
height: 100vh;
width: 300px;
display: flex;
flex-direction: row;
position:absolute;
text-align:center;
overflow-y:scroll;
  & div > a {
    width:100px;
    color: white;
  }

  &  {
    width:200px;
    background-color:${colors.navtext};
    
  }

  & .nav-item {
    width: 100%;
    color:white;
    height:50px;
    font-size: 16px;
  }

  .nav-item:hover  {
    background-color:${colors.highlight2};
    border:1px white solid;
    
  }
  .nav-item a {
    border: none; 
    color:white;
  }

`;
function TypeList(props) {
    const [state, setState] = useState(false);
    const closeModalAdd = () => setState(false);

        const  {types}  = props.types;


        if (types.length === 0) {
            return <h2>Please add your first type</h2>;
        }
        let typeList = types.map(item => {

            return  <Nav.Item key={item.id} onClick={() => props.isClicked(item.name)}> 
                <Type id="typelink" key={item.id} type={item} /> </Nav.Item>;
        });

        return (

//         <Navbar.Brand href="/"> <Navbar.Brand >Clothing Types <a onClick={() => setState(true)} ><FileAddOutlined /></a></Navbar.Brand>
// </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
<>
            <div>   <h5>Categories <FileAddOutlined onClick={() => setState(true)} /> </h5></div>
            <StyledNav variant="tabs"  className="flex-lg-column">
                {state ? <AddType 
                isOpenTypeAdd={state}
                closeModalTypeAdd={closeModalAdd}
                /> : null }
                <hr/>
                
            {typeList}

          </StyledNav>
          </>
  
        );
        
  }


const mapStateToProps = state => ({
    types: state.types
});

export default connect(mapStateToProps, {})(TypeList);