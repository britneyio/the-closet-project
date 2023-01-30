import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getClothing } from './ClothingActions';
import Item from './Item';
import { CardGroup } from 'react-bootstrap';
import './item.css'
function ClothingList(props) {


        const { clothing } = props.clothing;

        if (clothing.length === 0) {
            return <h2>Please add your first item</h2>;
        }
        let items = clothing.map(item => {

            return  <Item key={item.id} item={item} />;
        });

        return(
              
            <CardGroup className={"container"}>
              {items}
              </CardGroup>
        );
    }


ClothingList.propTypes = {
    getClothing: PropTypes.func.isRequired,
    clothing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    clothing: state.clothing
});

export default connect(mapStateToProps, {getClothing})(ClothingList);