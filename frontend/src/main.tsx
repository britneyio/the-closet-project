import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store";
import App from "./app/App";
import { GlobalStyle } from "./styles/GlobalStyle";
import { initSentry, ErrorBoundary } from "./sentry";
import "./styles/global.css";

initSentry();

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<p>Something went wrong. Please refresh.</p>}>
      <Provider store={store}>
        <GlobalStyle />
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer hideProgressBar newestOnTop position="bottom-center" />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
