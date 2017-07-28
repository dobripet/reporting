import { COLUMN_LIST_ADD_POST } from '../column/column-actions'
import { JOIN_EDIT_OPEN, JOIN_EDIT_SAVE, JOIN_EDIT_CLOSE, JOIN_EDIT_SELECT_PATH, JOIN_SPLIT_JOIN, JOIN_CREATE_JOIN, JOIN_REMOVE_ENTITY, JOIN_EDIT_JOIN_START} from './join-actions'
import { MENU_CLEAR, MENU_LOAD_QUERY } from '../menu/menu-actions'
import { updateObject, updateItemInArray, deepCloneJoinParameters, getPathsBetween, createJoinParameter, getJoinKeysFromPath, createJoinTypes, getJoinedEntities } from '../utils/utils'
import {INNER_JOIN} from './join-types'
import typeToReducer from 'type-to-reducer'
const initialState = {
    //joinTree: {},
    parameters: [],
    //joinedEntities: [],
    //selectedEntity: null,
    editParameters: null,
    editIndex: null,
    confirmOnly: false,
    loading: false,
    error: null,
    lastJoinFailed: false
};
const editSelectPath = (editParameters, payload) => {
    //let obj = {editParameters : []};
    console.log('editpath', payload, editParameters);
    editParameters.joinKeys = getJoinKeysFromPath(payload.entities, payload.selectedPath);
    editParameters.joinTypes = createJoinTypes(editParameters.joinKeys.length, INNER_JOIN);
    editParameters.selectedPath = payload.selectedPath;
    console.log('editparam', editParameters);
    return deepCloneJoinParameters(editParameters);
};
const removeEntity = (parameters, payload) =>{
    console.log('remove ', payload);
    /*let obj = {};
    let result = removeEntityFromJoinParameters(parameters, payload.entityName, payload.entities);
    obj.parameters = result.parameters;
    if(result.openModal){
        obj.confirmOnly = true;
        obj.editParameters = deepCloneJoinParameters(result.parameters[result.editIndex]);
        obj.editIndex = result.editIndex;
    }*/
    const obj = {
        parameters: []
    };
    const {
        entityName,
        entities
    } = payload;
    let openModal = false;
    let index = -1;
    parameters.forEach((param, i) => {
        //skip if entity starts selected path, for i == 0 its ok to remove first and for rest it is handled in step i-1
        console.log("remove2 ", param.selectedPath, parameters.length, entityName);
        if(param.selectedPath[0] === entityName){
            console.log("first");
            return;
        } else if (param.selectedPath[param.selectedPath.length-1] === entityName && i === parameters.length-1) {
            // last in the end  remove
            console.log("last");
            return;
        } else if(param.selectedPath[param.selectedPath.length-1] === entityName) {
            //if selected path ends with entity to remove, create new join to next params end
            const next = parameters[i+1].selectedPath[param.selectedPath.length-1];
            const result = createJoinParameter(entities, param.selectedPath[0], next, INNER_JOIN);
            obj.parameters.push(deepCloneJoinParameters(result.parameter));
            openModal = result.openModal;
            index = i;
            return;
        }
        obj.parameters.push(deepCloneJoinParameters(param));
    });
    if(openModal){
        obj.confirmOnly = true;
        obj.editParameters = deepCloneJoinParameters(parameters[index]);
        obj.editIndex = index;
    }
    return obj;
};
/*const getAddPostProcessed = (payload) =>{
    let obj = {
        loading: false,
        parameters: payload.builder.joinParameters
    };
    if(payload.builder.status === 1){
        obj.editParameters = deepCloneJoinParameters(payload.builder.joinParameters[payload.builder.joinParameters.length-1]);
        obj.confirmOnly = true;
        obj.editIndex = payload.builder.joinParameters.length-1;
    }
    return obj;
};*/
const splitJoin = (parameters, payload) => {
    let index = payload.index;
    let parameter = parameters[payload.parameterIndex];
    //create new selected paths
    let selectedPathOne = parameter.selectedPath.slice(0, index+1);
    let selectedPathTwo = parameter.selectedPath.slice(index+1, parameter.selectedPath.length);
    if(!Array.isArray(parameter.joinKeys)){
        throw 'Join parameter joinKeys is not array!'
    }
    //create new join keys
    let joinKeysOne = parameter.selectedPath.slice(0, index);
    let joinKeysTwo = parameter.selectedPath.slice(index, parameter.selectedPath.length);
    //recalculate all possible paths
    let pathsOne = getPathsBetween(payload.entities, selectedPathOne[0], selectedPathOne[selectedPathOne.length-1]);
    let pathsTwo = getPathsBetween(payload.entities, selectedPathTwo[0], selectedPathTwo[selectedPathTwo.length-1]);
    //create new joins
    let newJoinOne = {
        selectedPath: selectedPathOne,
        joinKeys: joinKeysOne,
        paths: pathsOne
    };

    let newJoinTwo = {
        selectedPath: selectedPathTwo,
        joinKeys: joinKeysTwo,
        paths: pathsTwo
    };
    console.log('new joins from split ', newJoinOne, newJoinTwo);
    let newParameters = [];
    for (let i = 0; i < parameter.length; i++){
        if(i=== payload.parameterIndex){
            newParameters.push(deepCloneJoinParameters(newJoinOne));
            newParameters.push(deepCloneJoinParameters(newJoinTwo));
        }else{
            newParameters.push(deepCloneJoinParameters(parameter[i]));
        }
    }
    return newParameters;
};
const createJoin = (parameters, payload) => {
    let obj = {};
    let result = createJoinParameter(payload.entities, payload.start, payload.end, INNER_JOIN);
    if(result.parameter){
        obj.parameters = [...parameters, result.parameter];
        if(result.openModal){
            obj.confirmOnly = true;
            obj.editParameters = deepCloneJoinParameters(result.parameter);
            obj.editParameters.joinedEntities = getJoinedEntities(parameters);
            obj.editIndex = obj.parameters.length-1;
        }
        obj.lastJoinFailed = false;
    }else{
        //path not found
        //obj.parameters = [...parameters];
        obj.lastJoinFailed = true;
    }
    console.log('joinparam', result, obj);
    return obj;
};
const changeJoinStart = (param, payload) => {
    let result = createJoinParameter(payload.entities, payload.joinStart, param.selectedPath[param.selectedPath.length-1], INNER_JOIN);
    console.log('newpar', result.parameter);
    return result.parameter;
    //return createJoinParameter(payload.entities, payload.joinStart, param.selectedPath[param.selectedPath.length-1], INNER_JOIN);
};
export default typeToReducer({
        /*[COLUMN_LIST_ADD_POST]: {
         PENDING: (state) => (
         updateObject(state, {
         editParameters: null,
         loading: true,
         error: null
         })
         ),
         REJECTED: (state, action) => (
         updateObject(state, {
         editParameters: null,
         loading: false,
         error: action.payload.error
         })
         ),
         FULFILLED: (state, action) => (
         updateObject(state, getAddPostProcessed(action.payload))
         ),
         },*/
    [JOIN_EDIT_OPEN]: (state, action) => (
        updateObject(state, {
            editParameters:  updateObject(
                deepCloneJoinParameters(state.parameters[action.payload.index]),
                {joinedEntities : getJoinedEntities(state.parameters, action.payload.index)}
                ),
            confirmOnly: false,
            editIndex: action.payload.index
        })
    ),
    [JOIN_EDIT_SAVE]:(state, action) => (
        updateObject(state, {
            parameters: updateItemInArray(state.parameters, action.payload.index, param => {
                console.log('cb ', param, deepCloneJoinParameters(action.payload.joinParameters));
                return updateObject(param, deepCloneJoinParameters(action.payload.joinParameters))
            }),
            editParameters: null
        })
    ),
    [JOIN_EDIT_CLOSE]:(state, action) => (
        updateObject(state, {
            editParameters: null
        })
    ),
    [JOIN_EDIT_SELECT_PATH]: (state, action) => {
        return updateObject(state, {editParameters: updateObject(
            editSelectPath(state.editParameters, action.payload),
            {joinedEntities : getJoinedEntities(state.parameters, action.payload.index)}
        )})
    },
    [JOIN_REMOVE_ENTITY]: (state, action) => (
        updateObject(state, removeEntity(state.parameters, action.payload))
    ),
    [JOIN_SPLIT_JOIN]: (state, action) => (
        updateObject(state, {
            parameters: splitJoin(state.parameters, action.payload)
        })
    ),
    [JOIN_CREATE_JOIN]: (state, action) => (
        updateObject(state, createJoin(state.parameters, action.payload))
    ),
    [MENU_CLEAR]:(state, action) => (
        updateObject(state, initialState)
    ),
    [MENU_LOAD_QUERY]:(state, action) => (
        updateObject(state, {parameters: action.payload.parameters.map(p=>deepCloneJoinParameters(p))})
    ),
    [JOIN_EDIT_JOIN_START]:(state,action) => (
        updateObject(state, {editParameters: updateObject(
            deepCloneJoinParameters(changeJoinStart(state.editParameters, action.payload)),
            {joinedEntities : getJoinedEntities(state.parameters, action.payload.index)}
        )})
    )

}, initialState);