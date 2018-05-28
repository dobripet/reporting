/**
 * Column actions, here are decided user clicks on add column
 *
 * Created by Petr on 3/21/2017.
 */
import {openModal, closeModal, TYPE_CONFIRM, TYPE_ERROR} from '../modal/modal-actions'
import {splitJoin, createJoin, removeEntity} from '../join/join-actions'
export const COLUMN_START_LOADER = 'COLUMN_START_LOADER';
export function startLoader() {
    return {
        type: COLUMN_START_LOADER,
        payload: {}
    }
}
export function stopLoader() {
    return {
        type: COLUMN_STOP_LOADER,
        payload: {}
    }
}
export const COLUMN_STOP_LOADER = 'COLUMN_STOP_LOADER';
export const COLUMN_LIST_ADD = 'COLUMN_LIST_ADD';
//entity and array of properties
export function addPropertiesToColumnList(entity, properties) {
    return (dispatch, getState) => {
        let state = getState();
        let params = state.join.parameters;
        let columns = state.column.columns;
        //basic debug check
        if (!Array.isArray(properties) || !Array.isArray(params) || !Array.isArray(columns)) {
            throw 'Properties, parameters or columns are not array!'
        }
        //create columns records from given data
        let columnsArray = [];
        for (let property of properties) {
            const columnName = `${entity.name} ${property.name}`;
            columnsArray.push({
                name: columnName,
                propertyName: property.name,
                entityName: entity.name,
                dataType: property.dataType,
                title: columnName
            });
        }
        dispatch(startLoader());
        //start processing add
        //first add
        if (columns.length === 0 || (params.length === 0 && columns[0].entityName === entity.name)) {
            dispatch({
                type: COLUMN_LIST_ADD,
                payload: {columns: columnsArray, join: false}
            });
            return;
        }
        //entity connected in join
        for (let j = 0; j < params.length; j++) {
            if (Array.isArray(params[j].selectedPath)) {
                for (let i = 0; i < params[j].selectedPath.length; i++) {
                    if (params[j].selectedPath[i] === entity.name) {
                        //entity directly joined
                        if (i === 0 || i === params[j].selectedPath.length - 1) {
                            dispatch({
                                type: COLUMN_LIST_ADD,
                                payload: {columns: columnsArray, join: false}
                            });
                            return;
                        } else {
                            //entity conned via selected path, do split path to create new connection
                            dispatch(splitJoin(j, i));
                            dispatch({
                                type: COLUMN_LIST_ADD,
                                payload: {columns: columnsArray, join: false}
                            });
                            return;
                        }
                    }
                }
            } else {
                //stop loader, should not happened
                dispatch(stopLoader());
                throw 'Parameter selectedPath is not array!'
            }
        }
        //need to make join
        //if first join join to present entity
        if (params.length === 0) {
            dispatch(createJoin(columns[0].entityName, entity.name));
        } else {
            //else to last join
            dispatch(createJoin(params[params.length - 1].selectedPath[params[params.length - 1].selectedPath.length - 1], entity.name));
        }
        state = getState();
        if (state.join.lastJoinFailed) {
            //stop loader
            dispatch(stopLoader());
            //show error message
            dispatch(openModal(closeModal(), "Invalid action! There is no possible way to add selected column/s", TYPE_ERROR));
        } else {
            dispatch({
                type: COLUMN_LIST_ADD,
                payload: {columns: columnsArray, join: true}
            });
        }
    }
}
export const COLUMN_LIST_REMOVE = 'COLUMN_LIST_REMOVE';
export function removeColumnFromColumnList(columnIndex) {
    return (dispatch, getState) => {
        let state = getState();
        let column = state.column.columns[columnIndex];
        //check if removed columns is last for given entity and there are any joins
        if (state.column.columns.filter(c => c.entityName === column.entityName).length <= 1 && state.join.parameters && state.join.parameters.length > 0) {
            //else ask for remove in modal
            dispatch(openModal(dispatch => {
                    dispatch(removeEntity(column.entityName));
                    dispatch({
                        type: COLUMN_LIST_REMOVE,
                        payload: columnIndex
                    });
                },
                `Removing ${column.propertyName} will delete all joins following ${column.entityName}. Proceed?`,
                TYPE_CONFIRM));
            return;
        }
        //else just remove
        dispatch({
            type: COLUMN_LIST_REMOVE,
            payload: columnIndex
        });
    }
}
export const COLUMN_LIST_EDIT = 'COLUMN_LIST_EDIT';
export function editColumnTitle(columnIndex, title) {
    return {
        type: COLUMN_LIST_EDIT,
        payload: {columnIndex, title}
    }
}

export const COLUMN_LIST_RECHECK = 'COLUMN_LIST_RECHECK';
export function recheckColumnList() {
    return (dispatch, getState) => {
        dispatch({
            type: COLUMN_LIST_RECHECK,
            payload: {parameters: getState().join.parameters}
        });
    }
}