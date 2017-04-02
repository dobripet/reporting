export const COLUMN_LIST_ADD = 'COLUMN_LIST_ADD';
//entity and array of properties
export function addPropertiesToColumnList(entity, properties){
    if (!Array.isArray(properties)){
        throw "Properties are not array!"
    }
    let columnsArray = [];
    for(let property of properties){
        //TODO displayName
        const columnName = `${entity.name} ${property.name}`;
        console.log('wtf,', property);
        columnsArray.push({name: columnName, propertyName: property.name, entityName: entity.name, dataType: property.dataType});
    }
    return {
        type: COLUMN_LIST_ADD,
        payload: columnsArray
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
export const COLUMN_LIST_SET_AGGREGATE = 'COLUMN_LIST_EDIT';
export function setAggregateFunction(columnIndex, aggregateFunction){
    return {
        type: COLUMN_LIST_SET_AGGREGATE,
        payload: {columnIndex, aggregateFunction}
    }
}