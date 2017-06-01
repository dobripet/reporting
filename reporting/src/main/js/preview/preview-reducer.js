import { COLUMN_LIST_ADD_POST } from '../column/column-actions'
import typeToReducer from 'type-to-reducer'
const initialState = {
    conditions: [],
    loading: false,
    loaded: false,
    error: null,
};

export default typeToReducer({
    [COLUMN_LIST_ADD_POST]: {
        PENDING: (state) => (
            Object.assign( {}, state, {
                loading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            Object.assign( {}, state, {
                loading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            Object.assign( {}, state, {
                loading: false,
                loaded: Date.now(),
                sql: action.payload.sql
            })
        ),
    }
}, initialState);