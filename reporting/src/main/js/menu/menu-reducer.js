import { MENU_SAVE, MENU_LOAD_ALL_QUERIES, MENU_LOAD_QUERY, MENU_NEW_QUERY, SHOW_SAVED_OK} from './menu-actions'
import { updateObject, formatDateTime } from '../utils/utils'
import typeToReducer from 'type-to-reducer'
const initialState = {
    error: null,
    id: null,
    queries : [],
    name: '',
    loading: false,
    showSavedOK: false
};

export default typeToReducer({
    [MENU_SAVE]: {
        PENDING: (state) => (
            updateObject(state, {
                loading: true,
                error: null,
                showSavedOK: false
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
                name: action.payload.queryName,
                showSavedOK: false
            })
        ),
    },
    [MENU_LOAD_ALL_QUERIES]: {
        PENDING: (state) => (
            updateObject(state, {
                loading: true,
                error: null,
                showSavedOK: false
            })
        ),
        REJECTED: (state, action) => (
            updateObject(state, {
                loading: false,
                error: action.payload.error,
                showSavedOK: false
            })
        ),
        FULFILLED: (state, action) => (
            updateObject(state, {
                loading: false,
                queries: action.payload,
                showSavedOK: false
            })
        ),
    },
    [MENU_LOAD_QUERY]:(state, action) => (
        updateObject(state, {
            name: action.payload.queryName,
            id: action.payload.id,
            showSavedOK: false
        })
    ),
    [MENU_NEW_QUERY]:(state, action) => (
        updateObject(state, {
            name: '',
            id: null,
            showSavedOK: false
        })
    ),
    [SHOW_SAVED_OK]:(state, action) => (
        updateObject(state, {
            showSavedOK: true
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