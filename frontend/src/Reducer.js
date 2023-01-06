import { createRouterReducer } from '@lagunovsky/redux-react-router'
import { clothingReducer } from './components/clothing/ClothingReducer';
import { signinReducer } from './components/signin/SigninReducer';
import { signupReducer } from './components/signup/SignupReducer';
import { typeReducer } from './components/types/TypeReducer';


const rootReducer =  (history) => ({
    router: createRouterReducer(history),
    createUser: signupReducer,
    auth: signinReducer,
    clothing: clothingReducer,
    types: typeReducer
  })

export default rootReducer;