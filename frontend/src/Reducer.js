import { createRouterReducer } from '@lagunovsky/redux-react-router'
import { clothingReducer } from './components/clothing/ClothingReducer';
import { outfitReducer } from './components/outfits/OutfitReducer';
import { signinReducer } from './components/signin/SigninReducer';
import { signupReducer } from './components/signup/SignupReducer';
import { typeReducer } from './components/types/TypeReducer';


const rootReducer =  (history) => ({
    router: createRouterReducer(history),
    createUser: signupReducer,
    auth: signinReducer,
    clothing: clothingReducer,
    types: typeReducer,
    outfits: outfitReducer,
  })

export default rootReducer;