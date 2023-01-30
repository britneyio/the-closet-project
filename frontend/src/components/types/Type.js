import React from 'react';
import PropTypes from 'prop-types';
import withRouter from '../../withRouter';
import { connect } from "react-redux";
import { Nav } from 'react-bootstrap';

function Type(props)  {
        const { type } = props;
        return (
    <Nav.Link> {type.name} </Nav.Link>

        );
    }


Type.propTypes = {
    type: PropTypes.object.isRequired
};



const mapStateToProps = state => ({});


export default connect(mapStateToProps, {}) (withRouter(Type));