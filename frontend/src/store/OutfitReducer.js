import {GET_OUTFITS, ADD_OUTFIT, DELETE_OUTFIT, UPDATE_OUTFIT, GET_OUTFIT_BY_ID} from "./types";

const initialState = {
    outfits: [],
};

export const outfitReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_OUTFITS:
            return {
                ...state,
                outfits: action.payload,
            };
        case ADD_OUTFIT:
            return {
                ...state,
                outfits: [...state.outfits, action.payload],
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
        case GET_OUTFIT_BY_ID:
            return {
                ...state,
                outfits: action.payload
            };

        default: 
            return state;
    }
};