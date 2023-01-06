import { GET_TYPES, ADD_TYPE, DELETE_TYPE, UPDATE_TYPE} from "./TypeTypes";

const initialState = {
    types: []
};

export const typeReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_TYPES:
            return {
                ...state,
                types: action.payload
            };
        case ADD_TYPE:
            return {
                ...state,
                types: [...state.types, action.payload]
        
            };
        case DELETE_TYPE:
            return {
                ...state,
                types: state.types.filter((item,index) => item.id !== action.payload)
            };
        case UPDATE_TYPE:
            const updatedTypes = state.types.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, ...action.payload};
                }
                return item;
            });
            return {
                ...state,
                clothing: updatedTypes
            };
        default: 
            return state;
    }
};