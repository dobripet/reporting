import {
    JOIN_EDIT_OPEN,
    JOIN_EDIT_SAVE,
    JOIN_EDIT_CLOSE,
    JOIN_EDIT_SELECT_PATH,
    JOIN_SPLIT_JOIN,
    JOIN_CREATE_JOIN,
    JOIN_REMOVE_ENTITY,
    JOIN_EDIT_JOIN_START,
    JOIN_REMOVE_RECHECKED
} from './join-actions'
import {MENU_CLEAR, MENU_LOAD_QUERY} from '../menu/menu-actions'
import {
    splitJoin,
    deepCloneJoinParameters,
    createJoinParameter,
    getJoinKeysFromPath,
    createJoinTypes,
    getJoinedEntities,
    removeEntityFromJoinParameters
} from '../utils/join-utils'
import {updateObject, updateItemInArray} from '../utils/utils'
import {INNER_JOIN} from './join-types'
import typeToReducer from 'type-to-reducer'
/**
 * Join reducer
 *
 * Created by Petr on 4/5/2017.
 */
const initialState = {
    parameters: [],
    forceRecheck: false,
    editParameters: null,
    editIndex: null,
    confirmOnly: false,
    loading: false,
    error: null,
    lastJoinFailed: false
};
const editSelectPath = (editParameters, payload) => {
    editParameters.joinKeys = getJoinKeysFromPath(payload.entities, payload.selectedPath);
    editParameters.joinTypes = createJoinTypes(editParameters.joinKeys.length, INNER_JOIN);
    editParameters.selectedPath = payload.selectedPath;
    return deepCloneJoinParameters(editParameters);
};
const removeEntity = (parameters, payload) => {
    return removeEntityFromJoinParameters(parameters, payload.entityName);
};

const splitAllJoins = (parameters, payload) => {
    let splitEntity = parameters[payload.parameterIndex].selectedPath[payload.index];
    let newParameters = [];
    let splitParameters = [];
    let splitIndexes = [];
    //find splits
    for (let i = 0; i < parameters.length; i++) {

        for (let j = 1; j < parameters[i].selectedPath.length - 1; j++) {
            //entity inside join
            if (parameters[i].selectedPath[j] === splitEntity) {
                splitParameters.push(splitJoin(payload.entities, parameters, j, i));
                splitIndexes.push(i);
                break;
            }
        }
    }
    //transform parameters with new splits
    for (let i = 0; i < parameters.length; i++) {
        if (i === payload.parameterIndex) {
            newParameters.push(deepCloneJoinParameters(splitParameters[0][0]));
            newParameters.push(deepCloneJoinParameters(splitParameters[0][1]));

        } else if (splitIndexes.indexOf(i) > 0) {
            newParameters.push(deepCloneJoinParameters(splitParameters[splitIndexes.indexOf(i)][1]));
        } else {
            newParameters.push(deepCloneJoinParameters(parameters[i]));
        }
    }

    return newParameters;
};
const createJoin = (parameters, payload) => {
    let obj = {};
    let result = createJoinParameter(payload.entities, payload.start, payload.end, INNER_JOIN);
    if (result.parameter) {
        obj.parameters = [...parameters, result.parameter];
        if (result.openModal) {
            obj.confirmOnly = true;
            obj.editParameters = deepCloneJoinParameters(result.parameter);
            obj.editParameters.joinedEntities = getJoinedEntities(parameters);
            obj.editIndex = obj.parameters.length - 1;
        }
        obj.lastJoinFailed = false;
    } else {
        //path not found
        obj.lastJoinFailed = true;
    }
    return obj;
};
const changeJoinStart = (param, payload) => {
    let result = createJoinParameter(payload.entities, payload.joinStart, param.selectedPath[param.selectedPath.length - 1], INNER_JOIN);
    return result.parameter;
};
export default typeToReducer({
    [JOIN_EDIT_OPEN]: (state, action) => (
        updateObject(state, {
            editParameters: updateObject(
                deepCloneJoinParameters(state.parameters[action.payload.index]),
                {joinedEntities: getJoinedEntities(state.parameters, action.payload.index)}
            ),
            confirmOnly: false,
            editIndex: action.payload.index
        })
    ),
    [JOIN_EDIT_SAVE]: (state, action) => (
        updateObject(state, {
            parameters: updateItemInArray(state.parameters, action.payload.index, param => {
                return updateObject(param, deepCloneJoinParameters(action.payload.joinParameters))
            }),
            editParameters: null
        })
    ),
    [JOIN_EDIT_CLOSE]: (state, action) => (
        updateObject(state, {
            editParameters: null
        })
    ),
    [JOIN_EDIT_SELECT_PATH]: (state, action) => {
        return updateObject(state, {
            editParameters: updateObject(
                editSelectPath(state.editParameters, action.payload),
                {joinedEntities: getJoinedEntities(state.parameters, state.editIndex)}
            )
        })
    },
    [JOIN_REMOVE_ENTITY]: (state, action) => (
        updateObject(state, removeEntity(state.parameters, action.payload))
    ),
    [JOIN_SPLIT_JOIN]: (state, action) => (
        updateObject(state, {
            parameters: splitAllJoins(state.parameters, action.payload)
        })
    ),
    [JOIN_CREATE_JOIN]: (state, action) => (
        updateObject(state, createJoin(state.parameters, action.payload))
    ),
    [MENU_CLEAR]: (state, action) => (
        updateObject(state, initialState)
    ),
    [MENU_LOAD_QUERY]: (state, action) => (
        updateObject(state, {parameters: action.payload.parameters.map(p => deepCloneJoinParameters(p))})
    ),
    [JOIN_EDIT_JOIN_START]: (state, action) => (
        updateObject(state, {
            editParameters: updateObject(
                deepCloneJoinParameters(changeJoinStart(state.editParameters, action.payload)),
                {joinedEntities: getJoinedEntities(state.parameters, state.editIndex)}
            )
        })
    ),
    [JOIN_REMOVE_RECHECKED]: (state, action) => (
        updateObject(state, {forceRecheck: false})
    )
}, initialState);