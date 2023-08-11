import {SET_SELECTED_ITEM, UNSET_SELECTED_ITEM} from "./types";

const initialState = {
    draggableItems: []
}


const toolTipReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_ITEM:
            return {
                ...state,
                draggableItems: [...state.draggableItems, action.payload]

    };
        case UNSET_SELECTED_ITEM:
            return {
                ...state,
                draggableItems: state.draggableItems.filter((item,index) => item.id !== action.payload)
            };
        default:
            return state;
    }
};