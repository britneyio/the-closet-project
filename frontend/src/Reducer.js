import { createRouterReducer } from '@lagunovsky/redux-react-router'
import { signinReducer } from './components/signin/SigninReducer';
import { signupReducer } from './components/signup/SignupReducer';


const rootReducer =  (history) => ({
    router: createRouterReducer(history),
    createUser: signupReducer,
    auth: signinReducer

  })

export default rootReducer;