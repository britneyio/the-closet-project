import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignupModal from "./signup/SignupModal";
import SigninModal from "./signin/SigninModal";
class Home extends Component {
    state = {
        isOpenIn: false,
        isOpenUp: false
    };
    openModalIn = () => this.setState({ isOpenIn: true});
    closeModalIn = () => this.setState({ isOpenIn: false});
    openModalUp = () => this.setState({ isOpenUp: true});
    closeModalUp = () => this.setState({ isOpenUp: false});

  

  render() {
    return (
      <Container>
        <h1>Home</h1>
        <div>
            <Button onClick={this.openModalIn}>Sign in</Button>
            {this.state.isOpenIn ? 
            <SigninModal
                closeModalIn={this.closeModalIn}
                isOpenIn={this.state.isOpenIn}
                /> : null }
                </div>
        <div>
            <Button onClick={this.openModalUp}>Sign up</Button>
            {this.state.isOpenUp ? 
            <SignupModal
                closeModalIn={this.closeModalUp}
                isOpenUp={this.state.isOpenUp}
                /> : null }
                </div>
        <p>
            <Link to="/closet">Closet</Link>
        </p>
      </Container>
    );
  }
}

export default Home;