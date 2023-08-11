import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Closet from "./components/closet/Closet";
import Outfits from "./components/outfits/Outfits";
import { ToastContainer } from "react-toastify";
import Root from "./Root";
import axios from "axios";
import AuthenticationComponent from './utils/RequireAuth';
import OutfitCreator from './components/creator/OutfitCreator';
axios.defaults.baseURL = "http://127.0.0.1:8000";
class App extends Component {
  render() {
    return (
      
      <div>
        <Root>
        <ToastContainer hideProgressBar={true} newestOnTop={true} />
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route  path="/closet" element={
              <AuthenticationComponent>
                <Closet />
                </AuthenticationComponent>
            } />
            <Route  path="/outfits" element={
              <AuthenticationComponent>
                <Outfits />
                </AuthenticationComponent>
            } />
              <Route  path="/outfit-creator" element={
              <AuthenticationComponent>
                <OutfitCreator />
                </AuthenticationComponent>
            } />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Root>
      </div>
    );
  }
}

function NotFound() {
  return <>You have landed on a page that doesn't exist</>;
}

export default App;