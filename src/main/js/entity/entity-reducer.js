/**
 * Created by Petr on 3/13/2017.
 */
import { ENTITY_LIST_FETCH } from './entity-actions'
import typeToReducer from 'type-to-reducer'
const initialState = {
    entities: [],
    loading: false,
    loaded: false,
    error: null
};

export default typeToReducer({
    [ ENTITY_LIST_FETCH ]: {
        PENDING: (state) => ({
            ...state,
            loading: true
        }),
        REJECTED: (state, action) => ({
            ...state,
            loading: false,
            error: action.payload
        }),
        FULFILLED: (state, action) => ({
            ...state,
            loading: false,
            loaded: true,
            entities: action.payload
        })
    }
}, initialState);