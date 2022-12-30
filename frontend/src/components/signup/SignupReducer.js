import {
    CREATE_USER_ERROR,
    CREATE_USER_SUBMITTED,
    CREATE_USER_SUCCESS
} from "./SignupTypes";

// define the initial state of the sign up store
const initialState = {
    usernameError: "",
    passwordError: "",
    emailError: "",
    isSubmitted: false
};

// define how action will change the state of the store
export const signupReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_USER_SUBMITTED:
            return {
                usernameError: "",
                passwordError: "",
                emailError: "",
                isSubmitted: true
            };
        case CREATE_USER_ERROR:
            const errorState = {
                usernameError: "",
                passwordError: "",
                emailError: "",
                isSubmitted: false
            };
            if (action.errorData.hasOwnProperty("username")) {
                errorState.usernameError = action.errorData["username"];
            }
            if (action.errorData.hasOwnProperty("email")) {
                errorState.emailError = action.errorData["email"];
            }
            if (action.errorData.hasOwnProperty("password")) {
                errorState.passwordError = action.errorData["password"];
            }

            return errorState;
        case CREATE_USER_SUCCESS:
            return {
                usernameError: "",
                passwordError: "",
                emailError: "",
                isSubmitted: false
            };
        default:
            return state;
    }
}