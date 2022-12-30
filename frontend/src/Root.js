import { configureStore } from '@reduxjs/toolkit'
import rootReducer from "./Reducer";
import { createBrowserHistory } from "history";
import { createRouterMiddleware, ReduxRouter } from '@lagunovsky/redux-react-router'
import thunk from 'redux-thunk';
import { Provider } from "react-redux";
import { setCurrentUser, setToken } from "./components/signin/SigninActions"; // new imports
import { isEmpty } from "./utils/Utils";

const Root = ({ children,     preloadedState
  = {} }) => {
  const history = createBrowserHistory();
  const middleware = [thunk, createRouterMiddleware(history)];
  const store = configureStore({
    middleware: middleware,
    reducer:  rootReducer(history),
    preloadedState
  });

     // check localStorage
  if (!isEmpty(localStorage.getItem("token"))) {
    store.dispatch(setToken(localStorage.getItem("token")));
  }
  if (!isEmpty(localStorage.getItem("user"))) {
    const user = JSON.parse(localStorage.getItem("user"));
    store.dispatch(setCurrentUser(user, ""));
  }
return (
  <Provider store={store}>
    <ReduxRouter history={history}>{children}</ReduxRouter>
  </Provider>
);
};

export default Root