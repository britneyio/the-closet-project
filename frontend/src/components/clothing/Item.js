import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
    render() {
        const { item } = this.props;
        return (
            <div>
                <img src={item.cover} />
                <p>Name: {item.name}</p>
                <p>Last worn: {item.worn}</p>
                <p>Location: {item.location}</p>
                <p>Clothing type: {item.ctype}</p>
            </div>
        );
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
};

export default Item;