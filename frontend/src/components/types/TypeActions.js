import axios from 'axios';
import { toastOnError } from '../../utils/Utils';
import { GET_TYPES, ADD_TYPE, DELETE_TYPE, UPDATE_TYPE } from './TypeTypes';

// returns list of clothing
export const getTypes = () => dispatch => {
    axios.get('/api/v1/clothingtype/')
    .then(response => {
        dispatch({
            type: GET_TYPES,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// adds an item to the list of clothing
export const addType = type => dispatch => {
    axios.post('/api/v1/clothingtype/', type)
    .then(response => {
        dispatch({
            type: ADD_TYPE,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// deletes an item
export const deleteType = id => dispatch => {
    axios.delete(`/api/v1/clothingtype/${id}/`)
    .then(response => {
        dispatch({
            type: DELETE_TYPE,
            payload: id
        });
    }).catch(error => {
        toastOnError(error);
    });
};

// updates an item
export const updateType = (id, type) => dispatch => {
    axios.put(`/api/v1/clothingtype/${id}/`, type)
    .then(response => {
        dispatch({
            type: UPDATE_TYPE,
            payload: response.data
        });
    }).catch(error => {
        toastOnError(error);
    });
};