import axios from 'axios';
import { toast } from 'react-toastify';
import {
    CREATE_USER_ERROR,
    CREATE_USER_SUBMITTED,
    CREATE_USER_SUCCESS
  } from "./SignupTypes";

  export const signupUser = userData => dispatch => {
      dispatch({ type: CREATE_USER_SUBMITTED});
      axios.post("/api/v1/users/", userData)
      .then(response => {
          toast.success("Account for " +
          userData.username + 
          " created sucessfully. Please login.");
        dispatch({ type: CREATE_USER_SUCCESS});
      }).catch(error => {
          if(error.response) {
              //response code that isn't 2xx
              toast.error(JSON.stringify(error.response.data));
              dispatch({
                  type: CREATE_USER_ERROR,
                  errorData: error.response.data
              });
          } else if (error.message) {
              // if a message is available
              // display it
              toast.error(JSON.stringify(error.message));
          } else {
              // unknown error
              toast.error(JSON.stringify(error));
          }
      })
  }