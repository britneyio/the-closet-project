import axios from "axios";
import { toast } from "react-toastify";

// sets or deletes the token for axios
export const setAxiosAuthToken = token => {
    // if the token is not undefined and true
    if (typeof token !== "undefined" && token) {
        // then put the token into the authorization header
        axios.defaults.headers.common["Authorization"] = "Token " + token;
    } else  {
        // if the token is undefined then delete auth header
        delete axios.defaults.headers.common["Authorization"];
    }
};

// returns errors through toastify
export const toastOnError = error => {
    if (error.response) {
        // known error
        toast.error(JSON.stringify(error.response.data));

    } else if (error.message) {
        toast.error(JSON.stringify(error.message));
    } else {
        toast.error(JSON.stringify(error));
    }
}

// determines if the value is empty
export const isEmpty = value => 
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);