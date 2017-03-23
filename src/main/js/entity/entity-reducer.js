/**
 * Created by Petr on 3/13/2017.
 */
import { ENTITY_LIST_FETCH, ENTITY_LIST_SEARCH } from './entity-actions'
import typeToReducer from 'type-to-reducer'
const initialState = {
    entities: [],
    filteredEntityList: [],
    loading: false,
    loaded: false,
    error: null,
    search: ''
};

const filterEntities = (entities, search) =>{
    if(!search) {
        return entities;
    }
    if(!Array.isArray(entities)){
        throw "Entities are not array!";
    }
    const text = search.toLowerCase();
    console.log("wtf",text);
    return entities.filter(entity => {
            return (entity.name.toLowerCase().includes(text) ||
            entity.properties.filter(property => property.name.toLowerCase().includes(text)).length > 0);
        }
    )
};
export default typeToReducer({
    [ ENTITY_LIST_FETCH ]: {
        PENDING: (state) => ({
            ...state,
            loading: true
        }),
        REJECTED: (state, action) => ({
            ...state,
            loading: false,
            error: action.payload
        }),
        FULFILLED: (state, action) => ({
            ...state,
            loading: false,
            loaded: true,
            entities: action.payload,
            filteredEntityList: filterEntities(action.payload, state.search)
        })
    },
    [ENTITY_LIST_SEARCH]: (state, action) => ({
        ...state,
        search: action.payload,
        filteredEntityList: filterEntities(state.entities, action.payload)
    })

}, initialState);