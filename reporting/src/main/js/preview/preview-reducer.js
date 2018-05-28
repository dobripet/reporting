import {QUERY_UPDATE_SQL_AND_PREVIEW} from '../query/query-actions'
import {updateObject} from '../utils/utils'
import {MENU_CLEAR} from '../menu/menu-actions'
import typeToReducer from 'type-to-reducer'
/**
 * Data preview reducer
 *
 * Created by Petr on 3/4/2017.
 */
const initialState = {
    data: [],
    columnNames: [],
    loading: false,
    loaded: false,
    error: null,
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
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            updateObject(state, {
                loading: false,
                data: action.payload.previewData,
                columnNames: action.payload.columns.map(c => c.title)
            })
        ),
    },
    [MENU_CLEAR]: (state, action) => (
        updateObject(state, initialState)
    )
}, initialState);