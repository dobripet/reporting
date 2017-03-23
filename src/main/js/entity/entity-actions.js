/**
 * Created by Petr on 3/13/2017.
 */
export const ENTITY_LIST_FETCH = 'ENTITY_LIST_FETCH';
export function fetchEntityList(){
    return {
        type: ENTITY_LIST_FETCH,
        payload: {
            promise: new Promise((resolve, reject) =>{
                fetch('http://localhost:8081/reporting/api/entities')
                    .then(response => response.json())
                    .then(json => resolve(json))
                    .catch(error => reject(error));
                }
            )
        }
    }
}

export const ENTITY_LIST_SEARCH = 'ENTITY_LIST_SEARCH';
export function searchEntityList(text){
    return {
        type: ENTITY_LIST_SEARCH,
        payload: text
    }
}
