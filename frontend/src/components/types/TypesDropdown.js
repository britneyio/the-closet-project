import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import withRouter from '../../withRouter';
import { connect } from "react-redux";
import { getTypes } from '../../middleware/TypeActions';
function TypesDropdown(props){

        const { types } = props.types;

        if (types.length === 0) {
            return <option >Please add your first item</option>
        }
        let type = types.map(item => {

            return  <option key={item.id} value={item.name}>{item.name}</option>
        });

        return (
                <Form.Select onChange={props.onChange} >

                    <option value={"Select a clothing type"}>Select a clothing type</option>
                    {type}
                </Form.Select>
        );
    }


TypesDropdown.propTypes = {
    getTypes: PropTypes.func.isRequired,
    types: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    types: state.types
});



export default connect(mapStateToProps, {getTypes}) (withRouter(TypesDropdown));