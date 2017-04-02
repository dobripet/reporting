/**
 * Created by Petr on 3/19/2017.
 */
export const CONDITION_LIST_ADD = 'CONDITION_LIST_ADD';
export function addCondition(){
    if (!Array.isArray(properties)){
        throw "Properties are not array!"
    }
    let columns = [];
    for(let property of properties){
        columns.push(`${entity} ${property}`);
    }
    return {
        type: CONDITION_LIST_ADD,
        payload: columns
    }
}
