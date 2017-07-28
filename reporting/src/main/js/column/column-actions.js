import {openModal, closeModal , TYPE_CONFIRM, TYPE_ERROR} from '../modal/modal-actions'
import {splitJoin, createJoin, removeEntity} from '../join/join-actions'
import {} from '../utils/utils'
export const COLUMN_START_LOADER = 'COLUMN_START_LOADER';
//TODO implementace loaderu v reducerech
export function startLoader(){
    return {
        type: COLUMN_START_LOADER,
        payload: {}
    }
}
export function stopLoader(){
    return {
        type: COLUMN_STOP_LOADER,
        payload: {}
    }
}
export const COLUMN_STOP_LOADER = 'COLUMN_STOP_LOADER';
export const COLUMN_LIST_ADD = 'COLUMN_LIST_ADD';
export const COLUMN_LIST_ADD_POST= 'COLUMN_LIST_ADD_POST';
//entity and array of properties
export function addPropertiesToColumnList(entity, properties) {
    return (dispatch, getState) => {
        //todo dispatch loading
        let state = getState();
        let params = state.join.parameters;
        let columns = state.column.columns;
        //basic debug check
        if (!Array.isArray(properties) || !Array.isArray(params) || !Array.isArray(columns)) {
            throw 'Properties, parameters or columns are not array!'
        }
        console.log(JSON.stringify(properties));
        //create columns records from given data
        let columnsArray = [];
        for (let property of properties) {
            const columnName = `${entity.name} ${property.name}`;
            console.log('wtf,', property);
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
        if(columns.length === 0 || (params.length === 0 && columns[0].entityName === entity.name)){
            dispatch({
                type: COLUMN_LIST_ADD,
                payload: columnsArray
            });
            return;
        }
        //entity connected in join
        for (let j = 0; j < params.length; j++) {
            console.log('tady1', params);
            if(Array.isArray(params[j].selectedPath)){
                for(let i = 0; i < params[j].selectedPath.length; i++) {
                    if (params[j].selectedPath[i] === entity.name) {
                        //entity directly joined
                        if(i === 0 || i === params[j].selectedPath.length-1){
                            dispatch({
                                type: COLUMN_LIST_ADD,
                                payload: columnsArray
                            });
                            return;
                        }else{
                            //entity conned via selected path, do split path to create new connection
                            dispatch(splitJoin(j,i));
                            dispatch({
                                type: COLUMN_LIST_ADD,
                                payload: columnsArray
                            });
                            return;
                        }
                    }
                }
                console.log('tady2');
            } else {
                //stop loader, should not happened
                dispatch(stopLoader());
                throw 'Parameter selectedPath is not array!'
            }
        }
        console.log('dvojka');
        //need to make join
        //if first join join to present entity
        if(params.length === 0){
            dispatch(createJoin(columns[0].entityName, entity.name));
        } else{
            //else to last join
            dispatch(createJoin(params[params.length-1].selectedPath[params[params.length-1].selectedPath.length-1], entity.name));
        }
        state = getState();
        if(state.join.lastJoinFailed){
            //stop loader
            dispatch(stopLoader());
            //show error message
            dispatch(openModal(closeModal(),"Invalid action! There is no possible way to add selected column/s", TYPE_ERROR));
        }else {
            dispatch({
                type: COLUMN_LIST_ADD,
                payload: columnsArray
            });
        }

        console.log("potom se stalo ", state);
        /*dispatch({
            type: COLUMN_LIST_ADD_POST,
            payload: fetch('http://localhost:8081/reporting/api/builder/columns', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    allColumns: state.column.columns,
                    action: 0,
                    columns: columnsArray,
                    allJoinParameters: state.join.parameters
                })
            }).then(response => {
                if(response.ok) {
                    return response.json().then(json => {
                        console.log('add post ', json);
                        if(json.builder.status === 10){
                            dispatch(openModal(closeModal(),"Invalid action! There is no possible way to add selected column/s", TYPE_ERROR));
                        } else{
                            dispatch({
                                type: COLUMN_LIST_ADD,
                                payload: columnsArray
                            });
                        }
                        return Promise.resolve(json)
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
        });*/
        console.log("potom se stalo ", state);
        /*dispatch({
            type: COLUMN_LIST_ADD,
            payload: columnsArray
        });*/

    }
}
export const COLUMN_LIST_REMOVE = 'COLUMN_LIST_REMOVE';
export const COLUMN_LIST_REMOVE_POST = 'COLUMN_LIST_REMOVE_POST';
export function removeColumnFromColumnList(columnIndex){
    return (dispatch, getState) => {
        let state = getState();
        let column = state.column.columns[columnIndex];
        //check if removed columns is last for given entity and there are any joins
        if(state.column.columns.filter(c => c.entityName === column.entityName).length <= 1 && state.join.parameters && state.join.parameters.length > 0){
            //TODO po novem navrhu rejoinu tohle nikdy nebude
            //check if it is middle entity
            for(let parameter of state.join.parameters) {
                for (let i = 1; i < parameter.selectedPath.length - 1; i++) {
                    if (column.entityName === parameter.selectedPath[i]) {
                        //if yes just remove, no need to rebuild
                        dispatch({
                            type: COLUMN_LIST_REMOVE,
                            payload: columnIndex
                        });
                        return;
                    }
                }
            }
            //else ask for remove in modal
            dispatch(openModal(dispatch => {
                    /*dispatch({
                        type: COLUMN_LIST_REMOVE_POST,
                        payload: fetch('http://localhost:8081/reporting/api/builder/columns', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                allColumns: state.column.columns,
                                action: 1,
                                columns: [column],
                                allJoinParameters: state.join.parameters
                            })
                        }).then(response => {
                            if(response.ok) {
                                return response.json().then(json => {
                                    console.log('remove post', json);
                                    return Promise.resolve(json)
                                });
                            } else {
                                return response.json().then(err => Promise.reject(err));
                            }
                        })
                    });
                    */
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
export function editColumnTitle(columnIndex, title){
    return {
        type: COLUMN_LIST_EDIT,
        payload: {columnIndex, title}
    }
}
export const COLUMN_LIST_SET_AGGREGATE = 'COLUMN_LIST_SET_AGGREGATE';
export function setAggregateFunction(columnIndex, aggregateFunction){
    return {
        type: COLUMN_LIST_SET_AGGREGATE,
        payload: {columnIndex, aggregateFunction}
    }
}