import axios from 'axios';
import { toastOnError } from '../../utils/Utils';
import { GET_OUTFITS, ADD_OUTFIT, DELETE_OUTFIT, UPDATE_OUTFIT } from './OutfitType';

// returns list of clothing
export const getOutfits = () => dispatch => {
    axios.get('/api/v1/outfit/')
    .then(response => {
        dispatch({
            type: GET_OUTFITS,
            payload: response.data
        });

    }).catch(error => {
        toastOnError(error);
    });
};

// adds an item to the list of clothing
const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
};

export const addOutfit = item => dispatch => {
    axios.post('/api/v1/outfit/', item)
    .then(response => {
        dispatch({
            type: ADD_OUTFIT,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// deletes an item
export const deleteOutfit = id => dispatch => {
    axios.delete(`/api/v1/outfit/${id}/`)
    .then(response => {
        dispatch({
            type: DELETE_OUTFIT,
            payload: id
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// updates an item
export const updateOutfit = (id, item) => dispatch => {
    axios.put(`/api/v1/outfit/${id}/`, item)
    .then(response => {
        dispatch({
            type: UPDATE_OUTFIT,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};

