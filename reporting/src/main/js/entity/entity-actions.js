/**
 * Created by Petr on 3/13/2017.
 */
export const ENTITY_LIST_FETCH = 'ENTITY_LIST_FETCH';
export function fetchEntityList() {
    return dispatch => dispatch({
        type: ENTITY_LIST_FETCH,
        payload: fetch(`${BASE_URL}/api/entities`)
            .then(response => {
                if(response.ok) {
                    return response.json().then(json => Promise.resolve(json));
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
        })
}
                /* fetch('http://localhost:8081/reporting/api/entities')
                 .then(response => response.json().then(json =>
                 response.ok ? json : Promise.reject(json)
                 )).catch(error => {console.log("cathc", error); reject(error)});*/
                /*.then(response => handleResponse(response)
                 .then(json => {console.log("resolve");resolve(json)})
                 .catch(error => {console.log("cathc", error); reject(error)});
                 }
                 )*/
/*
return dispatch => {
    return dispatch({
        type: 'FETCH_VEHICLE',
        payload: fetch(`http://swapi.co/api/vehicles/${id}/`)
            .then(status)
            .then(res => res.json())
            .catch(error => {
                return Promise.reject()
            })
    });
};
}
/*

function status(res) {
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res;
}*/
/*export function fetchEntityList () {
    return dispatch => dispatch({
        type: ENTITY_LIST_FETCH,
        payload: new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("asd"))
            }, 1000);
        })
    });
}*/
export const ENTITY_LIST_SEARCH = 'ENTITY_LIST_SEARCH';
export function searchEntityList(text){
    return {
        type: ENTITY_LIST_SEARCH,
        payload: text
    }
}


export const ENTITY_STATS_ROW_COUNT_FETCH = 'ENTITY_STATS_ROW_COUNT_FETCH';
export function getEntityRowCount(name){
    return dispatch => dispatch({
        type: ENTITY_STATS_ROW_COUNT_FETCH,
        payload: fetch(`${BASE_URL}/api/entities/${name}/stats/rowcount`)
            .then(response => {
                if(response.ok) {
                    return response.json().then(json => {
                        json.entityName = name;
                        return Promise.resolve(json)
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
    })
}
export const ENTITY_PROPERTY_STATS_FETCH = 'ENTITY_PROPERTY_STATS_FETCH';
export function getEntityPropertyStats(entityName, propertyName){
    return dispatch => dispatch({
        type: ENTITY_PROPERTY_STATS_FETCH,
        payload: fetch(`${BASE_URL}/api/entities${entityName}/properties/${propertyName}/stats`)
            .then(response => {
                if(response.ok) {
                return response.json().then(json => {
                    json.entityName = entityName;
                    json.propertyName = propertyName;
                    return Promise.resolve(json)
                });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
    })
}
