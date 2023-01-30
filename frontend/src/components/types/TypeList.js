import React, { useEffect, useState } from 'react';
import { getTypes } from './TypeActions';
import Type  from './Type';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';
import {FileAddOutlined} from '@ant-design/icons';
import AddClothingType from './AddType';
function TypeList(props) {
    const [state, setState] = useState(false);


        const  {types}  = props.types;

        if (types.length === 0) {
            return <h2>Please add your first type</h2>;
        }
        let typeList = types.map(item => {

            return  <Nav.Item key={item.id} > 
                <Type id="typelink" key={item.id} type={item} /> </Nav.Item>;
        });

        return (

            <Nav  id="sidebar"  variant="tabs"  className="flex-lg-column">
                <Navbar.Brand >Clothing Types <a onClick={() => setState(true)} ><FileAddOutlined /></a></Navbar.Brand>
                <AddClothingType isOpenTypeAdd={state} closeModalTypeAdd={() => setState(false)}/>
                {typeList}
 
              
            </Nav>
      
        );
        
  }

TypeList.propTypes = {
    getTypes: PropTypes.func.isRequired,
    types: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    types: state.types
});

export default connect(mapStateToProps, {getTypes})(TypeList);