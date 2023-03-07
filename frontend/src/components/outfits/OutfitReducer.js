import {  GET_OUTFITS, ADD_OUTFIT, DELETE_OUTFIT, UPDATE_OUTFIT} from "./OutfitType";

const initialState = {
    outfits: []
};

export const outfitReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_OUTFITS:
            return {
                ...state,
                outfits: action.payload
            };
        case ADD_OUTFIT:
            return {
                ...state,
                outfits: [...state.outfits, action.payload]
        
            };
        case DELETE_OUTFIT:
            return {
                ...state,
                outfits: state.outfits.filter((item,index) => item.id !== action.payload)
            };
        case UPDATE_OUTFIT:
            const updatedItems = state.outfits.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, ...action.payload};
                }
                return item;
            });
            return {
                ...state,
                outfits: updatedItems
            };
        default: 
            return state;
    }
};