import typeToReducer from 'type-to-reducer'
import { ENTITY_LIST_FETCH, ENTITY_LIST_SEARCH, ENTITY_STATS_ROW_COUNT_FETCH, ENTITY_PROPERTY_STATS_FETCH } from './entity-actions'
import { MENU_CLEAR } from '../menu/menu-actions'
import { deleteItemFromArray, updateItemInArray, updateObject } from '../utils/utils'
const initialState = {
    entities: {},
    loading: false,
    error: null,
    search: '',
    statsLoading: false,
    statsError: false
};

const addRowCount = (entities, payload) => {
    entities[payload.entityName].rowCount = payload.rowCount;
    return entities;
};
    /*for(let entity in entities){
        if(entities[entity].name === payload.name){
            console.log("row count ", payload);
            entities[entity].rowCount = payload.rowCount;
            return entities;
        }
    }
    return entities;
};*/
const addPropertyStats = (entities, payload) => {
    entities[payload.entityName].properties[payload.propertyName].statistic = payload;
    return entities;
};
export default typeToReducer({
    [ ENTITY_LIST_FETCH ]: {
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
            Object.assign( {}, state, {
                loading: false,
                loaded: Date.now(),
                entities: action.payload.reduce((entities, entity) => {
                    entities[entity.name] = entity;
                    return entities;
                }, {})
            })
        ),
    },
    [ENTITY_LIST_SEARCH]: (state, action) => (
        Object.assign( {}, state, {
            search: action.payload
        })
    ),
    [ ENTITY_STATS_ROW_COUNT_FETCH ]: {
        PENDING: (state) => (
            Object.assign({}, state, {
                statsLoading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            Object.assign({}, state, {
                statsLoading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            Object.assign({}, state, {
                statsLoading: false,
                loaded: Date.now(),
                entities: addRowCount(state.entities, action.payload)
            })
        )
    },
    [ ENTITY_PROPERTY_STATS_FETCH ]: {
        PENDING: (state) => (
            Object.assign({}, state, {
                statsLoading: true,
                error: null
            })
        ),
        REJECTED: (state, action) => (
            Object.assign({}, state, {
                statsLoading: false,
                error: action.payload.error
            })
        ),
        FULFILLED: (state, action) => (
            Object.assign({}, state, {
                statsLoading: false,
                statsLoaded: Date.now(),
                entities: addPropertyStats(state.entities, action.payload)
            })
        )
    },
    [MENU_CLEAR]:(state, action) => (
        updateObject(state, {
            search: '',
            statsError: false,
            error: null,
        })
    )
    }, initialState);