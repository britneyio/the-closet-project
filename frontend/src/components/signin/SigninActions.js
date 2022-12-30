import axios from "axios";
import { push } from '@lagunovsky/redux-react-router';
import { toast } from 'react-toastify';
import { SET_TOKEN, SET_CURRENT_USER, UNSET_CURRENT_USER } from "./SigninTypes";
import { setAxiosAuthToken, toastOnError } from "../../utils/Utils";

// post request to token/login endpoint in djoser
export const signin = (userData, redirectTo) => dispatch => {
    axios.post("/api/v1/token/login/", userData)
    .then(response => {
        // if successful post request then set the token in the headers
        const { auth_token } = response.data;
        setAxiosAuthToken(auth_token);
        // setToken saves the token in localStorage
        dispatch(setToken(auth_token));
        // request the user details
        dispatch(getCurrentUser(redirectTo));
    })
    .catch(error => {
        // if error then the localStorage is cleared
        dispatch(unsetCurrentUser());
        toastOnError(error);
    });
};

// sends post request to logout
export const signout = () => dispatch => {
    axios.post("/api/v1/token/logout/")
    .then(response => {
        // if success it clears the user data and token
        // it redirects the view to / URL
        // shows success
        dispatch(unsetCurrentUser());
        dispatch(push("/"));
        toast.success("Logout Successful.");
    }).catch(error => {
        // if error clears user data and token
        // show error toast
        dispatch(unsetCurrentUser());
        toastOnError(error);
    })
}
// uses GET request the current user data 
export const getCurrentUser = redirectTo => dispatch => {
    axios.get("/api/v1/users/me")
    .then(response => {
        const user = {
            username: response.data.username,
            email: response.data.email
        };
        dispatch(setCurrentUser(user, redirectTo));
    })
}

// store the current user variable into the localStorage and auth store
// if redirectTo isn't empty then a routing to its URL is pushed to history
export const setCurrentUser = (user, redirectTo) => dispatch => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
        type: SET_CURRENT_USER, // auth store
        payload: user
    });

    if (redirectTo !== "") {
        dispatch(push(redirectTo));
    }
}

// set the token variable in the request header, localStorage, and auth store
export const setToken = token => dispatch => {
    setAxiosAuthToken(token);
    localStorage.setItem("token", token);
    dispatch({
        type: SET_TOKEN,
        paylod: token
    });
};

//clears the localstorage data and auth store
export const unsetCurrentUser = () => dispatch => {
    setAxiosAuthToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({
        type: UNSET_CURRENT_USER
    });
};