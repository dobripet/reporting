export const QUERY_UPDATE_SQL_AND_PREVIEW = 'QUERY_UPDATE_SQL_AND_PREVIEW';
export function updateSqlAndPreview () {
    return (dispatch, getState) => {
        let state = getState();
        //workaround, deleted last column, clear all
        if(state.column.columns && state.column.columns.length === 0){
            dispatch({
                type: "QUERY_UPDATE_SQL_AND_PREVIEW_FULFILLED",
                payload: {
                    sqlAndPreview: {
                        sqlQuery: '',
                        previewData: []
                    },
                    columns: state.column.columns
                }
            });
            return;
        }
        //get data froms server
        dispatch({
            type: QUERY_UPDATE_SQL_AND_PREVIEW,
            payload: fetch(`${BASE_URL}/api/builder/sqlandpreview`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parameters: state.join.parameters,
                    columns: state.column.columns
                } )
            }).then(response => {
                if (response.ok) {
                    return response.json().then(json => {
                        console.log(json);
                        json.columns = getState().column.columns;
                        return Promise.resolve(json)
                    });
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
        })
    }
}
