import { createRouterReducer } from '@lagunovsky/redux-react-router'
import { clothingReducer } from './store/ClothingReducer';
import { outfitReducer } from './store/OutfitReducer';
import { signinReducer } from './store/SigninReducer';
import { signupReducer } from './store/SignupReducer';
import { typeReducer } from './store/TypeReducer';


const rootReducer =  (history) => ({
    router: createRouterReducer(history),
    createUser: signupReducer,
    auth: signinReducer,
    clothing: clothingReducer,
    types: typeReducer,
    outfits: outfitReducer,
  })

export default rootReducer;