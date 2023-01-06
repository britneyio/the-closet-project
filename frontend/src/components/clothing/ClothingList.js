import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getClothing } from './ClothingActions';
import Item from './Item';
import {Container, Row, Col} from 'react-bootstrap';

class ClothingList extends Component {

    componentDidMount() {

        this.props.getClothing();
    }

    render() {
        const { clothing } = this.props.clothing;

        if (clothing.length === 0) {
            return <h2>Please add your first item</h2>;
        }

        let items = clothing.map(item => {
            return <Item key={item.id} item={item} />;
        });

        return(
            <div>
                <h2>Clothing</h2>
                <Container>
            <Row>
                <Col sm>
              {items}
              </Col>
            </Row>
            </Container>
            </div>
        );
    }
}

ClothingList.propTypes = {
    getClothing: PropTypes.func.isRequired,
    clothing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    clothing: state.clothing
});

export default connect(mapStateToProps, {getClothing})(ClothingList);