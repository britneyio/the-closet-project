import React, { Component , useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { addItem } from './ClothingActions';
import DatePicker from 'react-date-picker';
class AddClothingItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            worn: "",
            location: "",
            ctype: "",
            cover: ""
        };

    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };

    onAddClick = () => {
        const item = {
                name: this.state.name,
                worn: this.state.worn,
                location: this.state.location,
                ctype: this.state.ctype,
                cover: this.state.cover
            };
            this.props.addItem(item);
        };


    render() {
        return (
            <div>
                            <Modal
            show={this.props.isOpenAdd}
            onHide={this.props.closeModalAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <h2>Add new item</h2>

                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                <Form>
                    <Form.Group controlId="nameId">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="clothing_name"
                            placeholder="favorite blue jeans"
                            value={this.state.name}
                            onChange={this.onChange}
                            />
                    </Form.Group>
                    <Form.Group controlId="wornId">
                        <Form.Label>Last worn:</Form.Label>
                        <Form.Control
                            type="date"
                            name="last_worn"
                            value={this.state.worn}
                            onChange={this.onChange}
                            />
                    </Form.Group>
                    <Form.Group controlId="locationId">
                        <Form.Label>Location:</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="top left drawer"
                            value={this.state.location}
                            onChange={this.onChange}
                            />
                    </Form.Group>
                    <Form.Group controlId="coverId">
                        <Form.Label>Last worn:</Form.Label>
                        <Form.Control
                            type="file"
                            name="cover"
                            value={this.state.cover}
                            onChange={this.onChange}
                            />
                    </Form.Group>
                </Form>
                </Modal.Body>
                </Modal>
            </div>
        );
    }
    }

AddClothingItem.propTypes = {
    addItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {addItem})(AddClothingItem);
