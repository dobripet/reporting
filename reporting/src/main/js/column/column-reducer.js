import typeToReducer from 'type-to-reducer'
import { COLUMN_LIST_ADD, COLUMN_LIST_REMOVE, COLUMN_LIST_EDIT, COLUMN_LIST_SET_AGGREGATE, COLUMN_LIST_ADD_POST} from './column-actions'
import { MENU_CLEAR, MENU_LOAD_QUERY } from '../menu/menu-actions'
import { deleteItemFromArray, updateItemInArray, updateObject } from '../utils/utils'
const initialState = {
    columns: [],
    showJoinModal: null,
    joinParameters: [],
   // columnsArray: {},
    loading: false,
    loaded: false,
    error: null,
};
/*const addNewColumns = (columns, payload) =>{
    for(let column of payload){
        columns.push(updateObject(column, {title: column.name}));
    }
    return columns;
};
const setAggregateFunction = (columns, columnIndex, aggregateFunction) =>{
    columns[columnIndex].aggregateFunction = aggregateFunction;
    return columns;
};*/
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

    //TODO handle not found path and delete that column
    /*
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

    } */
    return object;
};
export default typeToReducer({
    [COLUMN_LIST_ADD]: (state, action) =>(
        updateObject(state, {
            columns: [...state.columns, ...action.payload]
        })
    ),
    [COLUMN_LIST_REMOVE]: (state, action) => (
        updateObject(state, {
            columns: deleteItemFromArray(state.columns, action.payload)
        })
    ),
    [COLUMN_LIST_EDIT]: (state, action) => (
        updateObject(state, {
            columns: updateItemInArray(state.columns, action.payload.columnIndex, param => {
                return updateObject(param,{title: action.payload.title})
            })
        })
    ),
    [COLUMN_LIST_SET_AGGREGATE]: (state, action) => (
        updateObject(state, {
            columns: updateItemInArray(state.columns, action.payload.columnIndex, param => {
                return updateObject(param,{aggregateFunction: action.payload.aggregateFunction})
            })
        })
    ),
    [COLUMN_LIST_ADD_POST]: {
        PENDING: (state) => (
            updateObject(state, {
                loading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            updateObject(state, {
                loading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            updateObject(state, handleAddPostResponse(action.payload.builder, [...state.joinParameters])
            )
        ),
    },
    [MENU_CLEAR]:(state, action) => (
        updateObject(state, initialState)
    ),
    [MENU_LOAD_QUERY]: (state, action) => (
        updateObject(state, {columns: action.payload.columns.map(c => updateObject({},c))})
    )
}, initialState);