import typeToReducer from 'type-to-reducer'
import {
    COLUMN_LIST_ADD,
    COLUMN_LIST_REMOVE,
    COLUMN_LIST_EDIT,
    COLUMN_LIST_RECHECK
} from './column-actions'
import {MENU_CLEAR, MENU_LOAD_QUERY} from '../menu/menu-actions'
import {deleteItemFromArray, updateItemInArray, updateObject} from '../utils/utils'
import {getJoinedEntities} from '../utils/join-utils'

/**
 * Column reducer
 *
 * Created by Petr on 3/21/2017.
 */
const initialState = {
    columns: [],
    showJoinModal: null,
    joinParameters: [],
    loading: false,
    loaded: false,
    error: null,
};

const recheckColumns = (columns, parameters) => {
    let joinedEntities = getJoinedEntities(parameters);
    //filter all
    return columns.filter((column) => {
        return joinedEntities.indexOf(column.entityName) > -1;
    });
};
export default typeToReducer({
    [COLUMN_LIST_ADD]: (state, action) => (
        updateObject(state, {
            columns: [...state.columns, ...action.payload.columns]
        })
    ),
    [COLUMN_LIST_REMOVE]: (state, action) => (
        updateObject(state, {
            columns: deleteItemFromArray(state.columns, action.payload)
        })
    ),
    [COLUMN_LIST_EDIT]: (state, action) => (
        updateObject(state, {
            columns: updateItemInArray(state.columns, action.payload.columnIndex, param => {
                return updateObject(param, {title: action.payload.title})
            })
        })
    ),
    [MENU_CLEAR]: (state, action) => (
        updateObject(state, initialState)
    ),
    [COLUMN_LIST_RECHECK]: (state, action) => (
        updateObject(state, {columns: recheckColumns(state.columns, action.payload.parameters)})
    ),
    [MENU_LOAD_QUERY]: (state, action) => (
        updateObject(state, {columns: action.payload.columns.map(c => updateObject({}, c))})
    )
}, initialState);