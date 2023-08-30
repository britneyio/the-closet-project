import axios from "axios";
import {setCurrentUser, unsetCurrentUser} from "./SigninActions";
import { toastOnError } from '../utils/Utils';
import {push} from "@lagunovsky/redux-react-router";
import {toast} from "react-toastify";
import {SET_CURRENT_USER} from "../store/types";

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

export const updateUserEmail = (email, password) => dispatch => {
    const data = {
        "new_email" :  email,
        "current_password" : password
    }
    axios.post("/api/v1/users/set_username/", data)
        .then(response => {

            const user = localStorage.getItem('user')
            let username  = JSON.parse(user).username
            const newUser = {
                "username": username,
                "email":email
            }
            localStorage.setItem("user", JSON.stringify(newUser));
            dispatch({
                type: SET_CURRENT_USER, // auth store
                payload: user
            });

            // dispatch(push("/"));
            toast.success("Update Successful.");
        }).catch(error => {
    // show error toast
    toastOnError(error);
})
}

export const updateUserPassword = (previous, password) => dispatch => {
    const data = {
        "new_password" :  password,
        "current_password" : previous
    }
    axios.post("/api/v1/users/set_password/", data)
        .then(response => {

            // dispatch(push("/"));
            toast.success("Update Successful.");
        }).catch(error => {
        // show error toast
        toastOnError(error);
    })
}

export const updateUsername = (username) => dispatch => {
    const data = {
        "username":  username,
    }
    axios.patch("/api/v1/users/me/", data)
        .then(response => {

            // dispatch(push("/"));
            toast.success("Update Successful.");
            const user = localStorage.getItem('user')
            let email  = JSON.parse(user).email
            const newUser = {
                "username": username,
                "email":email
            }
            localStorage.setItem("user", JSON.stringify(newUser));
            dispatch({
                type: SET_CURRENT_USER, // auth store
                payload: user
            });
        }).catch(error => {
        // show error toast
        toastOnError(error);
    })
}
