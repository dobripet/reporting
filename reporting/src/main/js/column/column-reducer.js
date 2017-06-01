import { COLUMN_LIST_ADD, COLUMN_LIST_REMOVE, COLUMN_LIST_EDIT, COLUMN_LIST_SET_AGGREGATE, COLUMN_LIST_ADD_POST} from './column-actions'
import typeToReducer from 'type-to-reducer'
const initialState = {
    columns: [],
    showJoinModal: null,
    joinParameters: [],
   // columnsArray: {},
    loading: false,
    loaded: false,
    error: null,
};
const addNewColumns = (columns, payload) =>{
    for(let column of payload){
        columns.push(Object.assign( {}, column, {title: column.name}));
    }
    return columns;
};
const editColumnTitle = (columns, columnIndex, title) =>{
    columns[columnIndex].title = title;
    return columns;
};
const removeColumn = (columns, columnIndex) =>{
    columns.splice(columnIndex, 1);
    return columns;
};
const setAggregateFunction = (columns, columnIndex, aggregateFunction) =>{
    columns[columnIndex].aggregateFunction = aggregateFunction;
    return columns;
};
const handleAddPostResponse = (builder, joinParameters) =>{
    console.log('wtf o se deje', builder);
    let object = {
        loading: false,
        loaded: Date.now()
    };
    if(!builder){
        console.log("Error, builder is not defined!");
        return;
    }
    if(typeof(builder.status) != 'undefined' && builder.status != null){
        switch(builder.status){
            case 0 : {
                //entity already joined
                console.log("builder ", object);
                return object;
            }
            case 1 : {
                // builder new join
                joinParameters.push(builder.joinParameters);
                object.showJoinModal = joinParameters.length - 1;
                object.joinParameters = joinParameters;
                console.log("builder ", object);
                return object;
            }
        }
    }
};
export default typeToReducer({
    [COLUMN_LIST_ADD]: (state, action) =>(
        Object.assign( {}, state, {
            columns: addNewColumns([...state.columns], action.payload)
        })
    ),
    [COLUMN_LIST_REMOVE]: (state, action) => (
        Object.assign( {}, state, {
            columns: removeColumn([...state.columns], action.payload)
        })
    ),
    [COLUMN_LIST_EDIT]: (state, action) => (
        Object.assign( {}, state, {
            columns: editColumnTitle([...state.columns], action.payload.columnIndex, action.payload.title)
        })
    ),
    [COLUMN_LIST_SET_AGGREGATE]: (state, action) => (
        Object.assign( {}, state, {
            columns: setAggregateFunction([...state.columns], action.payload.columnIndex, action.payload.aggregateFunction)
        })
    ),
    [COLUMN_LIST_ADD_POST]: {
        PENDING: (state) => (
            Object.assign( {}, state, {
                loading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            Object.assign( {}, state, {
                loading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (

            Object.assign( {}, state, handleAddPostResponse(action.payload.builder, [...state.joinParameters])
            )
        ),
    }
}, initialState);