import { COLUMN_LIST_ADD, COLUMN_LIST_REMOVE, COLUMN_LIST_EDIT, COLUMN_LIST_SET_AGGREGATE } from './column-actions'
import typeToReducer from 'type-to-reducer'
const initialState = {
    columns: [],
   // columnsArray: {},
    loading: false,
    loaded: false,
    error: null,
};
const addNewColumns = (columns, payload) =>{
    for(let column of payload){
        columns.push({...column, title: column.name});
    }
    return columns;
};
const editColumnTitle = (columns, columnIndex, title) =>{
    columns[columnIndex].title = title;
    return columns;
};
const removeColumn = (columns, columnIndex) =>{
    columns.splice(columnIndex, 1) ;
    return columns;
};
const setAggregateFunction = (columns, columnIndex, aggregateFunction) =>{
    columns[columnIndex].aggregateFunction = aggregateFunction;
    return columns;
};
export default typeToReducer({
    [COLUMN_LIST_ADD]: (state, action) =>
        //if (state.entities.filter(entity => entity.name === action.payload.entity.name).length > 0) {
        ({
            ...state,
          //  columnsArray: [...state.columnsArray, ...action.payload],
            columns: addNewColumns([...state.columns], action.payload)
        }),
    [COLUMN_LIST_REMOVE]: (state, action) => ({
        ...state,
        columns: removeColumn([...state.columns], action.payload)
    }),
    [COLUMN_LIST_EDIT]: (state, action) => ({
        ...state,
        columns: editColumnTitle([...state.columns], action.payload.columnIndex, action.payload.title)
    }),
    [COLUMN_LIST_SET_AGGREGATE]: (state, action) => ({
    ...state,
    columns: setAggregateFunction([...state.columns], action.payload.columnIndex, action.payload.aggregateFunction)
})
}, initialState);