import { MENU_SAVE, MENU_LOAD_ALL_QUERIES, MENU_LOAD_QUERY, MENU_NEW_QUERY} from './menu-actions'
import { updateObject, formatDateTime } from '../utils/utils'
import typeToReducer from 'type-to-reducer'
const initialState = {
    error: null,
    id: null,
    queries : [],
    name: '',
    loading: false
};

export default typeToReducer({
    [MENU_SAVE]: {
        PENDING: (state) => (
            updateObject(state, {
                loading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            updateObject(state, {
                loading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            updateObject(state, {
                loading: false,
                id: action.payload.id,
                name: action.payload.queryName
            })
        ),
    },
    [MENU_LOAD_ALL_QUERIES]: {
        PENDING: (state) => (
            updateObject(state, {
                loading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            updateObject(state, {
                loading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            updateObject(state, {
                loading: false,
                queries: action.payload
            })
        ),
    },
    [MENU_LOAD_QUERY]:(state, action) => (
        updateObject(state, {
            name: action.payload.queryName,
            id: action.payload.id
        })
    ),
    [MENU_NEW_QUERY]:(state, action) => (
        updateObject(state, {
            name: '',
            id: null
        })
    )
}, initialState);
/*[MENU_CLEAR]:(state, action) => (
 updateObject(state, {
 opened: true,
 confirm: action.payload.confirm,
 decline: action.payload.decline,
 message: action.payload.message,
 type: action.payload.type
 })
 ),*/