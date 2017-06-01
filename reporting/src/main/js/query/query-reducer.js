import { CONDITION_LIST_ADD } from './condition-actions'
import typeToReducer from 'type-to-reducer'
const initialState = {
    conditions: [],
    loading: false,
    loaded: false,
    error: null,
};

export default typeToReducer({
    [CONDITION_LIST_ADD]: (state, action) =>
        //if (state.entities.filter(entity => entity.name === action.payload.entity.name).length > 0) {
        ({
            ...state,
            conditions: [...state.conditions, ...action.payload]
        })
}, initialState);