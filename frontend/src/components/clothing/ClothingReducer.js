import { GET_CLOTHING, ADD_ITEM, DELETE_ITEM, UPDATE_ITEM} from "./ClothingItemTypes";

const initialState = {
    clothing: []
};

export const clothingReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CLOTHING:
            return {
                ...state,
                clothing: action.payload
            };
        case ADD_ITEM:
            return {
                ...state,
                clothing: [...state.clothing, action.payload]
        
            };
        case DELETE_ITEM:
            return {
                ...state,
                clothing: state.clothing.filter((item,index) => item.id !== action.payload)
            };
        case UPDATE_ITEM:
            const updatedItems = state.clothing.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, ...action.payload};
                }
                return item;
            });
            return {
                ...state,
                clothing: updatedItems
            };
        default: 
            return state;
    }
};