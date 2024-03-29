import axios from 'axios';
import { toastOnError } from '../utils/Utils';
import { GET_CLOTHING, ADD_ITEM, DELETE_ITEM, UPDATE_ITEM } from '../store/types';

// returns list of clothing
export const getClothing = (page_num = 1) => async dispatch => {
    axios.get(`/api/v1/clothing/?page=${page_num}`)

    .then(response => {
        console.log("num", page_num)
        console.log("r", response.data)
         dispatch({
            type: GET_CLOTHING,
            payload: response.data.results,
            length: response.data.count,

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

export const addItem = item => dispatch => {
    axios.post('/api/v1/clothing/', item)
    .then(response => {
        dispatch({
            type: ADD_ITEM,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// deletes an item
export const deleteItem = id => dispatch => {
    axios.delete(`/api/v1/clothing/${id}/`)
    .then(response => {
        dispatch({
            type: DELETE_ITEM,
            payload: id
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// updates an item
export const updateItem = (id, item) => dispatch => {
    axios.put(`/api/v1/clothing/${id}/`, item)
    .then(response => {
        dispatch({
            type: UPDATE_ITEM,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};

