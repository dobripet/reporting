export const COLUMN_LIST_ADD = 'COLUMN_LIST_ADD';
export const COLUMN_LIST_ADD_POST= 'COLUMN_LIST_ADD_POST';
//entity and array of properties
export function addPropertiesToColumnList(entity, properties) {
    return (dispatch, getState) => {
        if (!Array.isArray(properties)) {
            throw "Properties are not array!"
        }
        let columnsArray = [];
        for (let property of properties) {
            //TODO displayName
            const columnName = `${entity.name} ${property.name}`;
            console.log('wtf,', property);
            columnsArray.push({
                name: columnName,
                propertyName: property.name,
                entityName: entity.name,
                dataType: property.dataType,
                displayed: true
            });
        }
        console.log("potom se stalo ", getState());
        dispatch({
            type: COLUMN_LIST_ADD_POST,
            payload: fetch('http://localhost:8081/reporting/api/builder/columns', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getState().column.columns)
            }).then(response => {
                if(response.ok) {
                    return response.json().then(json => {
                        console.log(json);
                        return Promise.resolve(json)
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
        });
        console.log("potom se stalo ", getState());
        dispatch({
            type: COLUMN_LIST_ADD,
            payload: columnsArray
        });

    }
}
export const COLUMN_LIST_REMOVE = 'COLUMN_LIST_REMOVE';
export function removeColumnFromColumnList(columnIndex){
    return {
        type: COLUMN_LIST_REMOVE,
        payload: columnIndex
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
