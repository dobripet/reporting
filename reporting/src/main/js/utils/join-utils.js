import _ from 'lodash'
import FastPriorityQueue from 'fastpriorityqueue'
import {updateObject} from './utils'


export function getParametersStart(params) {
    return params.selectedPath[0];
}
export function getParametersEnd(params) {
    return params.selectedPath[params.selectedPath.length - 1];
}
/**
 * Get list of joined entities
 * @param parameters
 * @param index
 * @returns {Array}
 */
export function getJoinedEntities(parameters, index) {
    let joinedEntities = {};
    //first run find all joined entities
    parameters.forEach((param, i) => {
        joinedEntities[getParametersStart(param)] = true;
        joinedEntities[getParametersEnd(param)] = true;
    });
    //delete all children to prevent breaking tree
    if (typeof index === 'number') {
        let children = [];
        fillChildren(children, parameters, getParametersEnd(parameters[index]));
        console.debug('children', children);
        children.forEach(c => {
            delete joinedEntities[c];
        })
    }
    console.debug('joinedEntities', parameters, joinedEntities, index);
    return Object.keys(joinedEntities);
}

const fillChildren = (children, parameters, child) => {
    //recursively find all children
    parameters.forEach(param => {
        if (getParametersStart(param) === child) {
            fillChildren(children, parameters, getParametersEnd(param));
        }
        if (getParametersEnd(param) === child) {
            children.push(child);
        }
    })
};

/**
 * Splits join for given entity
 * @param entities
 * @param parameters
 * @param index
 * @param parameterIndex
 * @returns {[*,*]}
 */
export function splitJoin(entities, parameters, index, parameterIndex) {
    let parameter = parameters[parameterIndex];
    //create new selected paths
    let selectedPathOne = parameter.selectedPath.slice(0, index + 1);
    let selectedPathTwo = parameter.selectedPath.slice(index, parameter.selectedPath.length);
    if (!Array.isArray(parameter.joinKeys)) {
        throw 'Join parameter joinKeys is not array!'
    }
    //create new join keys
    let joinKeysOne = parameter.joinKeys.slice(0, index);
    let joinKeysTwo = parameter.joinKeys.slice(index, parameter.selectedPath.length);
    if (!Array.isArray(parameter.joinTypes)) {
        throw 'Join parameter joinTypes is not array!'
    }

    let joinTypesOne = parameter.joinTypes.slice(0, index);
    let joinTypesTwo = parameter.joinTypes.slice(index, parameter.selectedPath.length);
    console.debug('parameter', parameter);
    //recalculate all possible paths
    let pathsOne = getPathsBetween(entities, selectedPathOne[0], selectedPathOne[selectedPathOne.length - 1]);
    let pathsTwo = getPathsBetween(entities, selectedPathTwo[0], selectedPathTwo[selectedPathTwo.length - 1]);
    //create new joins
    let newJoinOne = {
        selectedPath: selectedPathOne,
        joinKeys: joinKeysOne,
        joinTypes: joinTypesOne,
        paths: pathsOne
    };

    let newJoinTwo = {
        selectedPath: selectedPathTwo,
        joinKeys: joinKeysTwo,
        joinTypes: joinTypesTwo,
        paths: pathsTwo
    };
    return [newJoinOne, newJoinTwo];//newParameters;
}

/**
 * Removes whole entity branch from join parameters
 * @param parameters
 * @param entityName
 * @returns {{forceRecheck: boolean}}
 */
export function removeEntityFromJoinParameters(parameters, entityName) {
    let obj = {forceRecheck: false};
    obj.parameters = [];
    let children = [];
    parameters.forEach((param, i) => {
        //skip if entity starts selected path, for i == 0 its ok to remove first and for rest it is handled in step i-1
        if (getParametersStart(param) === entityName) {
            //join starts with given entity -> remove
            // and remove all children
            children.push(getParametersEnd(param));
            return;
        } else if (getParametersEnd(param) === entityName && i === parameters.length - 1) {
            // last in the end -> remove
            return;
        } else if (getParametersEnd(param) === entityName) {
            //join ends with given entity -> remove
            return;
        }
        obj.parameters.push(deepCloneJoinParameters(param));
        //remove by not adding to new params
    });
    if (children.length > 0) {
        obj.forceRecheck = true;
        for (let child of children) {
            //remove all children
            obj.parameters = removeEntityFromJoinParameters(obj.parameters, child).parameters;
        }
    }
    return obj;
}
/**
 * Checks if given entity is fixed in parameters
 * @param parameters
 * @param entity
 * @returns {boolean}
 */
export function isMiddleEntityFixedAnywhere(parameters, entity) {
    //check if middle entity is join start for any join
    let c = 0;
    parameters.forEach(p => {
        if (p.selectedPath[0] === entity) {
            c++;
        }
    });
    //if yes, check if there is another way to connect that entity
    let cc = 0;
    if (c > 0) {
        parameters.forEach(p => {
            for (let j = 1; j < p.selectedPath.length - 1; j++) {
                if (p.selectedPath[j] === entity) {
                    cc++;
                }
            }
        });
        //this is the only way
        if (cc < 2) {
            return true;
        }
    }
    //exists any other way
    return false;
}

/**
 * Prepares default join types
 * @param size
 * @param defaultJoinType
 * @returns {Array}
 */
export function createJoinTypes(size, defaultJoinType) {
    let joinTypes = [];
    for (let i = 0; i < size; i++) {
        joinTypes.push(defaultJoinType);
    }
    return joinTypes;
}

/**
 * Return index of selected path from given paths
 * @param paths
 * @param selectedPath
 * @returns {number}
 */
export function getSelectedPathIndex(paths, selectedPath) {
    for (let i = 0; i < paths.length; i++) {
        if (_.isEqual(paths[i], selectedPath)) {
            return i;
        }
    }
    //not found, should not happened
    return -1;
}

/**
 * Deep clone given parameters
 * @param parameters
 * @returns {{paths: Array, joinKeys: Array, joinTypes: [*], selectedPath: [*]}}
 */
export function deepCloneJoinParameters(parameters) {
    console.debug('deep clone ', parameters);
    //deep cloning keys
    let joinKeys = [];
    for (let keyList of parameters.joinKeys) {
        let list = [];
        for (let key of keyList) {
            //key has no nested objects
            list.push(updateObject({}, key));
        }
        joinKeys.push(list);
    }
    let joinTypes = [...parameters.joinTypes];
    let paths = [];
    for (let path of parameters.paths) {
        paths.push([...path]);
    }
    console.debug('deep clone new ', paths, joinKeys, [...parameters.selectedPath]);
    return {paths, joinKeys, joinTypes, selectedPath: [...parameters.selectedPath]};
}

/**
 * Finds best path and all paths that have length < bestPathLength + 2
 * @param entities
 * @param start - name of starting entity
 * @param end - name of ending entity
 * @returns found paths
 */
export function getPathsBetween(entities, start, end) {
    let t = ( new Date()).getTime();
    let priorityPath = getPriorityPathBetween(entities, start, end);
    console.debug('pathspriority: ', (new Date()).getTime() - t, priorityPath);
    if (!priorityPath) {
        return null;
    }

    t = ( new Date()).getTime();
    let r = getPathsForPriorityPath(entities, priorityPath);
    console.debug('pathsall: ', (new Date()).getTime() - t, r);
    return r;
}

/**
 * Creates join parameters for starting and ending entity from config
 * @param entities - config
 * @param start - name of starting entity
 * @param end - name of ending entity
 * @param defaultJoinType
 * @returns {*} new join parameters
 */
export function createJoinParameter(entities, start, end, defaultJoinType) {
    //let joinKeys = getJoinKeysFromSection(entities, start, end);
    let selectedPath = [];
    //join over multiple entities
    let paths = getPathsBetween(entities, start, end);
    console.debug('paths: ', paths);
    if (paths && paths.length > 0) {
        //priority one is the first
        selectedPath = paths[0];
        console.debug("INDIRECT JOIN");
        return {
            openModal: true,
            parameter: {
                selectedPath,
                paths,
                joinTypes: createJoinTypes(selectedPath.length - 1, defaultJoinType),
                joinKeys: getJoinKeysFromPath(entities, selectedPath)
            }
        }
    } else {
        //no path found
        console.debug("NO POSSIBLE JOIN");
        return {
            parameter: null
        }
    }
}

/**
 * Gets all join keys by sections from path
 * @param entities
 * @param path
 * @returns {Array}
 */
export function getJoinKeysFromPath(entities, path) {
    let allKeys = [];
    let start;
    for (let i = 0; i < path.length - 1; i++) {
        start = path[i];
        let end = path[i + 1];
        let keys = getJoinKeysFromSection(entities, start, end);
        if (keys) {
            allKeys.push(keys);
        } else {
            //should never happened
            console.warn(`There are no keys between ${start} and ${end}.`)
        }
    }
    return allKeys;
}

/**
 * Finds join keys between two nodes
 * @param entities config
 * @param start node
 * @param end node
 * @returns {*}
 */
const getJoinKeysFromSection = (entities, start, end) => {
    let keys = [];
    start = entities[start];
    if (Array.isArray(start.referredByMap[end]) && start.referredByMap[end].length > 0) {
        //clone keys
        keys = start.referredByMap[end].map(k => updateObject({}, k));
    }
    if (Array.isArray(start.referenceMap[end]) && start.referenceMap[end].length > 0) {
        //clone keys
        let tmp = start.referenceMap[end].map(k => updateObject({}, k));
        keys = keys.concat(tmp);
    }
    if (keys.length) {
        keys.sort((a, b) => a.weight - b.weight);
        //select first
        keys[0].selected = true;
        return keys;
    } else {
        return null;
    }
};

/**
 * Uses Dijktstra algorithm to find best path between entities
 *
 * @param entities - config
 * @param start name of starting entity
 * @param end - name of ending entity
 * @returns {*} found path
 */
const getPriorityPathBetween = (entities, start, end) => {
    let visited = {[start]: true};
    let heaped = {};
    let currentNode = {name: start, parent: null, distance: 0};
    heaped[start] = currentNode;
    let heap = FastPriorityQueue((a, b) => a.distance < b.distance);
    while (true) {
        for (let edge of getEdges(entities, currentNode.name)) {
            if (visited[edge.name]) {
                continue;
            }
            let newDistance = currentNode.distance + edge.weight;
            let temp = heaped[edge.name];
            //not in heap yet
            if (!temp) {
                temp = {name: edge.name, parent: currentNode.name, distance: newDistance};
                heaped[edge.name] = temp;
                heap.add(temp);
            } else if (temp.distance > newDistance) {
                //in heap and distance is bigger so update
                //workaround to update distance and keep heap sorted
                heap.heapify(heap.array.map(n => {
                        if (n.name === temp.name) {
                            n.distance = newDistance;
                            n.parent = currentNode.name;
                        }
                        return n;
                    })
                );
            }
        }
        visited[currentNode.name] = true;
        if (heap.isEmpty()) {
            console.debug(`No path found between ${start} and ${end}`);
            return null;
        }
        currentNode = heap.poll();
        //found path
        if (currentNode.name === end) {
            break;
        }
    }
    //reconstruct path
    let path = [];
    let name = currentNode.name;
    while (name) {
        path.push(name);
        name = heaped[name].parent;
    }
    path.reverse();
    console.debug('Shortest path: ', path);
    return path;
};

/**
 * Find all additional paths for given priority path
 * maximal length is priorityPath.length +1
 * @param entities config
 * @param priorityPath
 * @returns {Array}
 */
const getPathsForPriorityPath = (entities, priorityPath) => {
    let path = [];
    let visited = [];
    let allPaths = [];
    let start = priorityPath[0];
    let end = priorityPath[priorityPath.length - 1];
    let maxDepth = priorityPath.length + 1;
    modifiedDFS(entities, start, end, maxDepth, path, visited, allPaths);
    //switch priority path to start
    for (let i = 0; i < allPaths.length; i++) {
        if (_.isEqual(priorityPath, allPaths[i])) {
            allPaths[i] = allPaths[0];
            allPaths[0] = priorityPath;
            break;
        }
    }
    return allPaths;
};

/**
 * Modified depth first search, browsing to maximal depth
 * @param entities
 * @param tempStart
 * @param end
 * @param maxDepth
 * @param path
 * @param visited
 * @param allPaths
 */
const modifiedDFS = (entities, tempStart, end, maxDepth, path, visited, allPaths) => {
    // add node tempStart to current path from start
    path.push(tempStart);
    visited[tempStart] = true;
    // found path from start to end
    if (tempStart === end) {
        console.debug('PATH FOUND ', path);
        let p = [...path];
        allPaths.push(p);
    }
    // consider all neighbors that would continue path with repeating a node
    else {
        for (let neighbor of getNeighbors(entities, tempStart)) {
            if (!visited[neighbor] && path.length < maxDepth) {
                modifiedDFS(entities, neighbor, end, maxDepth, path, visited, allPaths);
            }
        }
    }
    // done exploring from tempStart, so remove from path
    path.pop();
    delete visited[tempStart];
};

/**
 * Returns neighbors, similar as edges but simpler without using weights
 * @param entities
 * @param tempStart
 * @returns {Array}
 */
const getNeighbors = (entities, tempStart) => {
    let neighbors = [];
    let references = Object.keys(entities[tempStart].referenceMap);
    let referredBy = Object.keys(entities[tempStart].referredByMap);
    for (let reference of references) {
        let e = entities[reference];
        if (e) {
            neighbors.push(reference);
        } else {
            console.warn(`Entity ${reference} referred by ${tempStart} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[tempStart].referenceMap[reference];
        }
    }
    for (let reference of referredBy) {
        let e = entities[reference];
        if (e) {
            neighbors.push(reference);
        } else {
            console.warn(`Entity ${reference} that references ${tempStart} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[tempStart].referredByMap[reference];
        }
    }
    return neighbors;
};

/**
 * Return weighted edges from given node
 * @param entities
 * @param node
 * @returns {Array}
 */
const getEdges = (entities, node) => {
    let edges = [];
    let entity = entities[node];
    if (!entity) {
        console.warn('Entity not found in config: ', node);
        return edges;
    }
    let references = Object.keys(entity.referenceMap);
    let referredBy = Object.keys(entity.referredByMap);
    for (let reference of references) {
        let e = entities[reference];
        if (e) {
            let keys = entity.referenceMap[reference];
            if (Array.isArray(keys) && keys.length > 0) {
                keys.sort((a, b) => a.weight - b.weight);
                edges.push({name: reference, weight: keys[0].weight});
            } else {
                console.warn(`Entity ${node} with reference ${reference} has null or empty foreign key! Backend configuration needs to be fixed!`);
                //WARNING: mutating application state, should not happened
                delete entities[node].referenceMap[reference];
            }
        } else {
            console.warn(`Entity ${reference} referred by ${node} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[node].referenceMap[reference];
        }
    }
    for (let reference of referredBy) {
        let e = entities[reference];
        if (e) {
            let keys = entity.referredByMap[reference];
            if (Array.isArray(keys) && keys.length > 0) {
                keys.sort((a, b) => a.weight - b.weight);
                edges.push({name: reference, weight: keys[0].weight});
            } else {
                console.warn(`Entity ${node} with referred by ${reference} has null or empty foreign key! Backend configuration needs to be fixed!`);
                //WARNING: mutating application state, should not happened
                delete entities[node].referredByMap[reference];
            }
        } else {
            console.warn(`Entity ${reference} that references ${node} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[node].referredByMap[reference];
        }
    }
    return edges;
};
