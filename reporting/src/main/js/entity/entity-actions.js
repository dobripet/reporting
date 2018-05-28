/**
 * Entity actions
 *
 * Created by Petr on 3/13/2017.
 */
export const ENTITY_LIST_FETCH = 'ENTITY_LIST_FETCH';
export function fetchEntityList() {
    return dispatch => dispatch({
        type: ENTITY_LIST_FETCH,
        payload: fetch(`${BASE_URL}/api/entities`)
            .then(response => {
                if (response.ok) {
                    return response.json().then(json => Promise.resolve(json));
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
    })
}

export const ENTITY_LIST_SEARCH = 'ENTITY_LIST_SEARCH';
export function searchEntityList(text) {
    return {
        type: ENTITY_LIST_SEARCH,
        payload: text
    }
}


export const ENTITY_STATS_ROW_COUNT_FETCH = 'ENTITY_STATS_ROW_COUNT_FETCH';
export function getEntityRowCount(name) {
    return dispatch => dispatch({
        type: ENTITY_STATS_ROW_COUNT_FETCH,
        payload: fetch(`${BASE_URL}/api/entities/${name}/stats/rowcount`)
            .then(response => {
                if (response.ok) {
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
export function getEntityPropertyStats(entityName, propertyName) {
    return dispatch => dispatch({
        type: ENTITY_PROPERTY_STATS_FETCH,
        payload: fetch(`${BASE_URL}/api/entities/${entityName}/properties/${propertyName}/stats`)
            .then(response => {
                if (response.status === 204) {
                    return Promise.resolve({entityName, propertyName, statistic: null});

                } else if (response.ok) {
                    return response.json().then(json => {
                        return Promise.resolve({entityName, propertyName, statistic: json})
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
    })
}
