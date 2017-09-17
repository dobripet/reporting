import {openModal, closeModal , TYPE_CONFIRM, TYPE_ERROR} from '../modal/modal-actions'
export const MENU_CLEAR = 'MENU_CLEAR';
export function clear () {
    return {
        type: MENU_CLEAR,
        payload: {}
    }
}
export const MENU_LOAD_ALL_QUERIES = 'MENU_LOAD_ALL_QUERIES';
export function loadAllQueries () {
    return (dispatch, getState) => {
        console.log('loadall');
        dispatch({
            type: MENU_LOAD_ALL_QUERIES,
            payload: fetch(`${BASE_URL}/api/builder/queries`)
                .then(response => {
                    if (response.ok) {
                        return response.json().then(json => {
                            console.log('save ', json);
                            return Promise.resolve(json)
                        });
                    } else {
                        return response.json().then(err => Promise.reject(err));
                    }
                })
        });
    }
}
export const MENU_SAVE = 'MENU__SAVE';
export function save (name, saveAs) {
    return (dispatch, getState) => {
        let state = getState();
        let id = state.menu.id;
        // null id will save as new record
        if(saveAs){
            id = null;
        }
        let url = `${BASE_URL}/api/builder/queries`;
        let method = 'POST';
        if(id){
            url = `${url}/${id}`;
            method = 'PUT';
        }
        dispatch({
            type:
            MENU_SAVE,
            payload: fetch(url, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    queryName: name,
                    columns: state.column.columns,
                    parameters: state.join.parameters
                })
            }).then(response => {
                if (response.status === 201 || response.status === 200) {
                    return response.json().then(json => {
                        console.log('save ', json);
                        //todo dispatch fading info that its ok
                        dispatch(savedOk());
                        return Promise.resolve(json)
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
        });
    }
}
export const MENU_LOAD_QUERY = 'MENU_LOAD_QUERY';
export function loadQuery (id) {
    return (dispatch, getState) => {
        let query = getState().menu.queries.filter(q=>q.id === id)[0];

        try {
            let params = JSON.parse(query.queryParameters);
            dispatch({
                type: MENU_LOAD_QUERY,
                payload: {
                    columns: params.columns,
                    parameters: params.parameters,
                    id: id,
                    queryName: query.queryName
                }
            })
        } catch (e){
            dispatch(openModal(closeModal(),"Failed to parse saved query!", TYPE_ERROR));
        }

    }
}
export const MENU_NEW_QUERY = 'MENU_NEW_QUERY';
export function newQuery () {
    return (dispatch) => {
        dispatch(clear());
        dispatch({
            type: MENU_NEW_QUERY,
            payload: {}
        })
    }
}
export const SHOW_SAVED_OK = 'SHOW_SAVED_OK';
export function savedOk () {
    return {
        type: SHOW_SAVED_OK,
        payload: {}
    }
}