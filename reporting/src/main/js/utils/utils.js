import _ from 'lodash'
import FastPriorityQueue from 'fastpriorityqueue'
export function normalizeForTableCell(object){
    if(object === null || typeof(object) === 'undefined'){
        return 'null'
    }
    if(object === false) {
        return 'false'
    }
    if(object === true) {
        return 'true'
    }
    return object;
}

export function roundDateTime(datetime){
    let timestamp = datetime;
    if(isNaN(datetime)) {
        timestamp = Date.parse(datetime);
    }
    if (isNaN(timestamp)){
        return null;
    }
    let date = new Date(timestamp);
    return date.getDate() + '.' + (date.getMonth()+1)+'.'+date.getFullYear();
}

export function formatDateTime(datetime){
    let timestamp = datetime;
    if(isNaN(datetime)) {
        timestamp = Date.parse(datetime);
    }
    if (isNaN(timestamp)){
        return null;
    }
    let date = new Date(timestamp);
    return date.getDate() + '.' + (date.getMonth()+1)+'.'+date.getFullYear()+' '
        +date.getHours()+ ':'+leadingZero(date.getMinutes())+':'+leadingZero(date.getSeconds());
}

const leadingZero = (number) =>{
    return number < 10 ? ("0"+number) : number;
};
//redux reducer helpers
export function updateObject(oldObject, newValues) {
    //avoid mutating
    return Object.assign({}, oldObject, newValues);
}

export function deleteItemFromArray(array, index){
    let a = [...array];
    a.splice(index, 1);
    console.log('array', a);
    return a;
}

export function getParametersStart(params){
    return params.selectedPath[0];
}
export function getParametersEnd(params){
    return params.selectedPath[params.selectedPath.length-1];
}

export function updateItemInArray(array, index, updateItemCallback) {
    const updatedItems = array.map((item, i) => {
        if(i !== index) {
            return item;
        }
        // Use the provided callback to create an updated item
        const updatedItem = updateItemCallback(item);
        console.log("upit ", updatedItem);
        return updatedItem;
    });

    console.log("items ", updatedItems);
    return updatedItems;
}

export function getJoinedEntities(parameters, index){
    let joinedEntities = {};
    //first run find all joined entities
    parameters.forEach((param, i) => {
        joinedEntities[getStart(param)] = true;
        joinedEntities[getEnd(param)] = true;
    });
    //delete all children to prevent breaking tree
    if(typeof index === 'number'){
        let children = [];
        fillChildren(children, parameters, getEnd(parameters[index]));
        console.log('children', children);
        children.forEach(c => {
            delete joinedEntities[c];
        })
    }
    console.log('joinedEntities', parameters, joinedEntities, index);
    return Object.keys(joinedEntities);
}

const fillChildren = (children, parameters, child) =>{
    //recursively find all children
    parameters.forEach(param => {
        if(getStart(param) === child){
            fillChildren(children, parameters, getEnd(param));
        }
        if(getEnd(param) === child){
            children.push(child);
        }
    })
};
const getEnd = (param) => {
    return param.selectedPath[param.selectedPath.length-1];
};
const getStart = (param) => {
    return param.selectedPath[0];
};

export function removeEntityFromJoinParameters(parameters, entityName, entities){
    let obj = {openModal: false};
    obj.parameters = [];
    parameters.forEach((param, i) => {
        //skip if entity starts selected path, for i == 0 its ok to remove first and for rest it is handled in step i-1
        if(param.selectedPath[0] === entityName){
            return;
        } else if (param.selectedPath[param.selectedPath.length-1] === entityName && i === parameters.length-1) {
            // last in the end  remove
            return;
        } else if(param.selectedPath[param.selectedPath.length-1] === entityName) {
            //if selected path ends with entity to remove, create new join to next params end
            let next = parameters[i+1].selectedPath[param.selectedPath.length-1];
            let result = createJoinParameter(entities, param.selectedPath[0], next);
            obj.parameters.push(deepCloneJoinParameters(result.parameter));
            obj.openModal = result.openModal;
            obj.editIndex = i;
            return;
        }
        obj.parameters.push(deepCloneJoinParameters(param));
            /*
            //check if any other entity from path is in columns(except last one)
            let shouldRemove = -1;
            for(let j = 1; j < param.selectedPath-1; j++){
                if(entityMap[param.selectedPath[j]]){
                    shouldRemove = j;
                    break;
                }
            }
            //remove whole join
            if(shouldRemove === -1){
                return;
            } else {
                //remake join
                param.selectedPath.splice(0,shouldRemove);
                param.joinKeys.splice(0,shouldRemove);
            }*/
            //remove by not adding to new params


    });
    return obj;
}

export function isMiddleEntityFixedAnywhere(parameters, entity){
    //check if middle entity is join start for any join
    let c = 0;
    parameters.forEach(p=>{
        if(p.selectedPath[0] === entity){
            c++;
        }
    });
    //if yes, check if there is another way to connect that entity
    let cc = 0;
    if( c > 0 ){
        parameters.forEach(p=>{
            for(let j = 1; j < p.selectedPath.length-1;j++){
                if(p.selectedPath[j] === entity){
                    cc++;
                }
            }
        });
        //this is the only way
        if( cc < 2){
            return true;
        }
    }
    //exists any other way
    return false;
}

export function removeJoins(parameters, entity, processed){
    parameters.forEach((param, i)=>{
        //join ends with entity
        if(param.selectedPath[param.selectedPath.length-1] === entity){
            for( let j = 1; j < param.selectedPath-1 ;j++){
                //some entities are tied to middle ones from this join so reconnect it
                if(isMiddleEntityFixedAnywhere(parameters, param.selectedPath[j])){

                }
            }
        }
    })
}

export function createJoinTypes(size, defaultJoinType) {
    let joinTypes = [];
    for(let i = 0; i < size; i++){
        joinTypes.push(defaultJoinType);
    }
    return joinTypes;
}

/*
const getJoinedColumnEntities = (columns) => {
    let entityMap = {};
    columns.forEach(c => entityMap[c.entityName] = true);
    return entityMap;
};
*/
export function getSelectedPathIndex(paths, selectedPath){
    for(let i = 0; i < paths.length; i++){
        if(_.isEqual(paths[i], selectedPath)){
            return i;
        }
    }
    //not found, should not happened
    return -1;
}

export function deepCloneJoinParameters(parameters){
    console.log('dc ', parameters);
    //deep cloning keys
    let joinKeys = [];
    for(let keyList of parameters.joinKeys){
        let list = [];
        for(let key of keyList){
            //key has no nested objects
            list.push(updateObject({},key));
        }
        joinKeys.push(list);
    }
    let joinTypes = [...parameters.joinTypes];
    let paths = [];
    for(let path of parameters.paths){
        paths.push([...path]);
    }
    console.log('dc.new ', paths, joinKeys, [...parameters.selectedPath]);
    return {paths, joinKeys, joinTypes, selectedPath: [...parameters.selectedPath]};
}

export function getPathsBetween(entities, start, end){
    let t = ( new Date()).getTime();
    let priorityPath = getPriorityPathBetween(entities, start, end);
    console.log('pathspriority: ', (new Date()).getTime()-t, priorityPath);
    if(!priorityPath){
        return null;
    }

    t = ( new Date()).getTime();
    let r = getPathsForPriorityPath(entities, priorityPath);
    console.log('pathsall: ', (new Date()).getTime()-t, r);
    return r ;
}

export function createJoinParameter(entities, start, end, defaultJoinType) {
    //let joinKeys = getJoinKeysFromSection(entities, start, end);
    let joinKeys = [];
    let joinTypes = [];
    let selectedPath = [];
    let paths = [];
    console.log('joinkeys',joinKeys);
    /*if(joinKeys && joinKeys.length > 0) {
        //direct join
        console.log("joinkeyslength", joinKeys.length);
        selectedPath = [start, end];
        paths.push(selectedPath);
        joinKeys = [joinKeys];
        //just one way to join, no need to dialog
        if (joinKeys[0].length === 1) {
            console.debug("DIRECT JOIN, ONE FK");
            return {
                openModal: false,
                parameter: {
                    selectedPath,
                    paths,
                    joinKeys
                }
            }
        } else {
            //ask for dialog and specification on key
            console.debug("DIRECT JOIN, MULTIPLE FK");
            return {
                openModal: true,
                parameter: {
                    selectedPath,
                    paths,
                    joinKeys
                }
            }
        }
    } else{*/
        console.log("druha vetev join");
        //join over multiple entities
        paths = getPathsBetween(entities, start, end);
        console.log('paths: ', paths);
        if(paths && paths.length > 0){
            //priority one is the first
            selectedPath = paths[0];
            console.debug("INDIRECT JOIN");
            return {
                openModal: true,
                parameter: {
                    selectedPath,
                    paths,
                    joinTypes: createJoinTypes(selectedPath.length-1, defaultJoinType),
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
   // }

}

export function getJoinKeysFromPath(entities, path){
    let allKeys = [];
    let start;
    for (let i = 0; i < path.length - 1; i++) {
        start = path[i];
        let end = path[i + 1];
        let keys = getJoinKeysFromSection(entities, start, end);
        if(keys) {
            allKeys.push(keys);
        }else {
            //should never happened
            console.warn(`There are no keys between ${start} and ${end}.`)
        }
    }
    return allKeys;
}

const getJoinKeysFromSection = (entities, start, end) => {
    let keys = [];
    start = entities[start];
    if(Array.isArray(start.referredByMap[end]) && start.referredByMap[end].length > 0) {
        //clone keys
        keys = start.referredByMap[end].map(k=>updateObject({},k));
    }
    if(Array.isArray(start.referenceMap[end]) && start.referenceMap[end].length > 0) {
        //clone keys
        let tmp = start.referenceMap[end].map(k=>updateObject({},k));
        keys = keys.concat(tmp);
    }
    if(keys.length) {
        keys.sort((a,b) => a.weight - b.weight);
        //select first
        keys[0].selected = true;
        return keys;
    } else {
        return null;
    }
};
/*// prepare join new entity
JoinParameters joinParameters = new JoinParameters();
List<List<String>> allPaths = new ArrayList<>();
List<String> selectedPath = new ArrayList<>();
List<ForeignKey> keys = new ArrayList<>();
Entity start = config.getEntities().get(joinedEntities.get(joinedEntities.size() - 1));
if (start.getReferredByMap().get(entityName) != null) {
    keys.addAll(start.getReferredByMap().get(entityName));
}
if (start.getReferenceMap().get(entityName) != null) {
    keys.addAll(start.getReferenceMap().get(entityName));
}
if (keys.size() > 0) {
    //direct join
    List<List<ForeignKey>> allKeys = new ArrayList<>();
    selectedPath.add(start.getName());
    selectedPath.add(entityName);
    allPaths.add(selectedPath);
    joinParameters.setPaths(allPaths);
    joinParameters.setSelectedPath(selectedPath);
    keys.sort(Comparator.comparingDouble(ForeignKey::getWeight));
    //select first
    keys.get(0).setSelected(true);
    allKeys = getJoinKeysFromPath(selectedPath);
    joinParameters.setJoinKeys(allKeys);
    allJoinParameters.add(joinParameters);
    //just one way to join, no need to dialog
    if (keys.size() == 1) {
        log.debug("ENTITY :" + entityName + " DIRECT JOIN, ONE FK");
        return new ColumnResponse(0, allJoinParameters);
    } else {
        //ask for dialog and specification on key
        log.debug("ENTITY :" + entityName + " DIRECT JOIN, MULTIPLE FK");
        return new ColumnResponse(1, allJoinParameters);
    }
}
//joinedEntities.add(entityName);
allPaths = getAllPaths(start, config.getEntities().get(entityName));
if (allPaths == null || allPaths.size() == 0) {
    //no path found
    log.debug("ENTITY :" + entityName + " NO PATH FOUND FROM : " + start.getName());
    return new ColumnResponse(10, allJoinParameters);
}
//at least one path found
joinParameters.setPaths(allPaths);
//priority one is the first
selectedPath = allPaths.get(0);
joinParameters.setSelectedPath(selectedPath);
joinParameters.setJoinKeys(getJoinKeysFromPath(selectedPath));
allJoinParameters.add(joinParameters);
//ask for dialog and specification on keys
log.debug("ENTITY :" + entityName + " INDIRECT JOIN");
return new ColumnResponse(1, allJoinParameters);
}

*/
//Uses Dijktstra algorithm to find best path between entities
const getPriorityPathBetween = (entities, start, end) => {
    let visited = {[start]: true};
    let heaped = {};
    let currentNode = {name: start, parent: null, distance: 0};
    heaped[start] = currentNode;
    let heap = FastPriorityQueue((a,b) => a.distance < b.distance);
    while(true){
        for(let edge of getEdges(entities, currentNode.name)) {
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
                //console.log("newdist", temp.distance, temp);
            } else if (temp.distance > newDistance) {
                //in heap and distance is bigger so update
                //console.log('updatedist', temp.distance , newDistance, temp);
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
        if(heap.isEmpty()){
            console.log(`No path found between ${start} and ${end}`);
            return null;
        }
        currentNode = heap.poll();
        //console.log('currentnode',currentNode);
        //found path
        if(currentNode.name === end){
            break;
        }
    }
    //reconstruct path
    let path = [];
    let name = currentNode.name;
    while(name){
        path.push(name);
        name = heaped[name].parent;
    }
    path.reverse();
    console.debug('Shortest path: ', path);
    return path;
};
const getPathsForPriorityPath = (entities, priorityPath) => {
    let path = [];
    let visited = [];
    let allPaths = [];
    let start = priorityPath[0];
    let end = priorityPath[priorityPath.length-1];
    let maxDepth = priorityPath.length + 1;
    modifiedDFS(entities, start, end, maxDepth, path, visited, allPaths);
    //switch priority path to start
    for(let i = 0; i < allPaths.length; i++){
        if(_.isEqual(priorityPath, allPaths[i])){
            allPaths[i] = allPaths[0];
            allPaths[0] = priorityPath;
            break;
        }
    }
    return allPaths;
};
const  modifiedDFS = (entities, tempStart, end, maxDepth, path, visited, allPaths) => {
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
            if (!visited[neighbor] && path.length < maxDepth){
                modifiedDFS(entities, neighbor, end, maxDepth, path, visited, allPaths);
            }
        }
    }
    // done exploring from tempStart, so remove from path
    path.pop();
    delete visited[tempStart];
};
//same as get edges but not weighted, so simpler
const getNeighbors = (entities, tempStart) => {
    let neighbors = [];
    let references = Object.keys(entities[tempStart].referenceMap);
    let referredBy = Object.keys(entities[tempStart].referredByMap);
    for(let reference of references){
        let e = entities[reference];
        if(e) {
            neighbors.push(reference);
        } else {
            console.warn(`Entity ${reference} referred by ${tempStart} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[tempStart].referenceMap[reference];
        }
    }
    for(let reference of referredBy){
        let e = entities[reference];
        if(e) {
            neighbors.push(reference);
        } else{
            console.warn(`Entity ${reference} that references ${tempStart} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[tempStart].referredByMap[reference];
        }
    }
    return neighbors;
};
//get weighted edges from node
const getEdges = (entities, node) => {
    let edges = [];
    let entity = entities[node];
    if(!entity){
        console.log('Entity not found in config: ', node);
        return  edges;
    }
    let references = Object.keys(entity.referenceMap);
    let referredBy = Object.keys(entity.referredByMap);
    for(let reference of references){
        let e = entities[reference];
        if(e){
            let keys = entity.referenceMap[reference];
            if(Array.isArray(keys) && keys.length > 0){
                keys.sort((a, b) => a.weight - b.weight);
                edges.push({name: reference, weight: keys[0].weight});
            }else {
                console.warn(`Entity ${node} with reference ${reference} has null or empty foreign key! Backend configuration needs to be fixed!`);
                //WARNING: mutating application state, should not happened
                delete entities[node].referenceMap[reference];
            }
        } else{
            console.warn(`Entity ${reference} referred by ${node} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[node].referenceMap[reference];
        }
    }
    for(let reference of referredBy){
        let e = entities[reference];
        if(e){
            let keys = entity.referredByMap[reference];
            if(Array.isArray(keys) && keys.length > 0){
                keys.sort((a, b) => a.weight - b.weight);
                edges.push({name: reference, weight: keys[0].weight});
            }else {
                console.warn(`Entity ${node} with referred by ${reference} has null or empty foreign key! Backend configuration needs to be fixed!`);
                //WARNING: mutating application state, should not happened
                delete entities[node].referredByMap[reference];
            }
        } else{
            console.warn(`Entity ${reference} that references ${node} not found in config! Backend configuration needs to be fixed!`);
            //WARNING: mutating application state, should not happened
            delete entities[node].referredByMap[reference];
        }
    }
    return edges;
};
