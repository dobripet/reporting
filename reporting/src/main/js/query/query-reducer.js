import { COLUMN_LIST_ADD, COLUMN_LIST_EDIT, COLUMN_LIST_REMOVE } from '../column/column-actions'
import {JOIN_EDIT_SAVE} from '../join/join-actions'
import { MENU_CLEAR, MENU_LOAD_QUERY } from '../menu/menu-actions'
import {QUERY_UPDATE_SQL_AND_PREVIEW} from './query-actions'
import { updateObject } from '../utils/utils'
import typeToReducer from 'type-to-reducer'
const initialState = {
    query: "None",
    loading: false,
    loaded: false,
    error: null,
    dirty: false,
};

export default typeToReducer({
    [QUERY_UPDATE_SQL_AND_PREVIEW]: {
        PENDING: (state) => (
            updateObject(state, {
                loading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            updateObject(state, {
                loading: false,
                dirty: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            updateObject(state, {
                dirty: false,
                loading: false,
                query: action.payload.sqlQuery
            })
        ),
    },
    [MENU_CLEAR]: (state, action) => (
        updateObject(state, initialState)
    ),
    [COLUMN_LIST_ADD]: (state, action) => (
        updateObject(state, {
            dirty: true
        })
    ),
    [COLUMN_LIST_EDIT]: (state, action) => (
        updateObject(state, {
            dirty: true
        })
    ),
    [COLUMN_LIST_REMOVE]: (state, action) => (
        updateObject(state, {
            dirty: true
        })
    )
    ,[JOIN_EDIT_SAVE]: (state, action) => (
        updateObject(state, {
            dirty: true
        })
    ),[MENU_LOAD_QUERY]: (state, action) => (
        updateObject(state, {
            dirty: true
        })
    )

}, initialState);