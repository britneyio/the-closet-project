import React, { Component } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signout } from '../signin/SigninActions';
import ClothingList from "../clothing/ClothingList";
import AddClothingItem from "../clothing/AddClothingItem";
import withRouter from "../../withRouter";
class Closet extends Component {
  onSignout = () => {
    this.props.signout();
  };

  render() {
    const { user } = this.props.auth;
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              User: <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link onClick={this.onSignout}>Sign out</Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <ClothingList />
          <AddClothingItem />
        </Container>
      </div>
    );
  }

}

Closet.propTypes = {
  signout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { signout })(withRouter(Closet));