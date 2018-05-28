/**
 * Join actions
 *
 * Created by Petr on 4/5/2017.
 */
import {openModal, closeModal, TYPE_ERROR} from'../modal/modal-actions'
import {recheckColumnList} from'../column/column-actions'
import {isMiddleEntityFixedAnywhere} from '../utils/join-utils'
export const JOIN_EDIT_OPEN = 'JOIN_EDIT_OPEN';
export function openJoinEdit(index) {
    return {
        type: JOIN_EDIT_OPEN,
        payload: {index}
    }
}
export const JOIN_EDIT_SAVE = 'JOIN_EDIT_SAVE';
export function saveJoinEdit(index, joinParameters) {
    return {
        type: JOIN_EDIT_SAVE,
        payload: {index, joinParameters}
    }
}
export const JOIN_EDIT_CLOSE = 'JOIN_EDIT_CLOSE';
export function closeJoinEdit() {
    return {
        type: JOIN_EDIT_CLOSE,
        payload: {}
    }
}
export const JOIN_EDIT_SELECT_PATH = 'JOIN_EDIT_SELECT_PATH';
export function selectJoinPath(selectedPath) {
    return (dispatch, getState) => {
        //check if old selected path can be changed
        let joinState = getState().join;
        let oldPath = joinState.editParameters.selectedPath;
        for (let i = 1; i < oldPath.length - 1; i++) {
            let entity = oldPath[i];
            if (isMiddleEntityFixedAnywhere(joinState.parameters, entity)) {
                return dispatch(openModal(closeModal(), `Error changing path, there is join starting with ${entity} that is on path.`, TYPE_ERROR));
            }
        }
        //everything is ok
        dispatch({
            type: JOIN_EDIT_SELECT_PATH,
            payload: {
                selectedPath,
                entities: getState().entity.entities
            }
        });
    }
}

export const JOIN_EDIT_JOIN_START = 'JOIN_EDIT_JOIN_START';
export function selectJoinStart(joinStart) {
    return (dispatch, getState) => {
        dispatch({
            type: JOIN_EDIT_JOIN_START,
            payload: {
                joinStart,
                entities: getState().entity.entities
            }
        });
    }
}


export const JOIN_SPLIT_JOIN = 'JOIN_SPLIT_JOIN';
export function splitJoin(parameterIndex, index) {
    return (dispatch, getState) => {
        dispatch({
            type: JOIN_SPLIT_JOIN,
            payload: {
                parameterIndex,
                entities: getState().entity.entities,
                index
            }
        })
    }
}
export const JOIN_CREATE_JOIN = 'JOIN_CREATE_JOIN';
export function createJoin(start, end) {
    return (dispatch, getState) => {
        dispatch({
            type: JOIN_CREATE_JOIN,
            payload: {
                start,
                end,
                entities: getState().entity.entities
            }
        })
    }
}

export const JOIN_REMOVE_ENTITY = 'JOIN_REMOVE_ENTITY';
export const JOIN_REMOVE_RECHECKED = 'JOIN_REMOVE_RECHECKED';
export function removeEntity(entityName) {
    return (dispatch, getState) => {
        dispatch({
            type: JOIN_REMOVE_ENTITY,
            payload: {
                entityName,
                entities: getState().entity.entities
            }
        });
        if (getState().join.forceRecheck) {
            dispatch(recheckColumnList());
            dispatch({
                type: JOIN_REMOVE_RECHECKED,
                payload: {}
            });
        }
    }
}
