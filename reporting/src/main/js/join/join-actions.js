import { openModal, closeModal, TYPE_CONFIRM } from'../modal/modal-actions'
export const JOIN_EDIT_OPEN = 'JOIN_EDIT_OPEN';
export function openJoinEdit (index) {
    return {
        type: JOIN_EDIT_OPEN,
        payload: {index}
    }
}
export const JOIN_EDIT_SAVE = 'JOIN_EDIT_SAVE';
export function saveJoinEdit (index, joinParameters) {
    return {
        type: JOIN_EDIT_SAVE,
        payload: {index, joinParameters}
    }
}
export const JOIN_EDIT_CLOSE = 'JOIN_EDIT_CLOSE';
export function closeJoinEdit () {
    return {
        type: JOIN_EDIT_CLOSE,
        payload: {}
    }
}
export const JOIN_EDIT_SELECT_PATH = 'JOIN_EDIT_SELECT_PATH';
export function selectJoinPath (selectedPath) {
    return (dispatch, getState) => {
        //check if any column is from middle path entity
        /*for(let i = 1;  i < selectedPath.length-1; i++){
            if(getState().column.columns.filter(c=>c.entityName === selectedPath[i]).length > 0 ){

            }
        }
        dispatch({
            type: JOIN_EDIT_SELECT_PATH,
            payload: fetch('http://localhost:8081/reporting/api/builder/joinkeys', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedPath)
            }).then(response => {
                if (response.ok) {
                    return response.json().then(json => {
                        json.selectedPath = selectedPath;
                        console.log(json);
                        return Promise.resolve(json)
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
        })*/
        dispatch({
            type: JOIN_EDIT_SELECT_PATH,
            payload: {
                selectedPath,
                entities: getState().entity.entities
                }
            });
    }
}


export const JOIN_SPLIT_JOIN = 'JOIN_SPLIT_JOIN';
export function splitJoin (parameterIndex, index) {
    return (dispatch, getState) =>{
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
export function createJoin (start, end) {
    return (dispatch, getState) =>{
        console.log('create ', start, end);
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
export function removeEntity (entityName) {
    return (dispatch, getState) =>{
        console.log('remove ', entityName);
        dispatch({
            type: JOIN_REMOVE_ENTITY,
            payload: {
                entityName,
                entities: getState().entity.entities
            }
        })
    }
}
