package cz.zcu.fav.kiv.dobripet.reporting.service;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.ForeignKey;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Petr on 5/24/2017.
 */
@Service("builderService")
//@Scope(value = "session")
public class BuilderServiceImpl implements BuilderService {
    Logger log = LoggerFactory.getLogger(BuilderService.class);

    @Autowired
    private Config config;

    private String query;

    //private Set<String> joinOrder;

    private List<JoinParameters> allJoinParameters = new ArrayList<>();

    private List<String> joinedEntities = new ArrayList<>();

    private List<Column> joinedColumns = new ArrayList<>();

    @Override
    public ColumnResponse getJoinFromColumns(ColumnRequest columnRequest) {

        //TODO frontend, aby alespon byla videt ta stranka a checkboxy atd...

        //TODO cache path po jednom spocitani v configu


        List<Column> joinedColumns = columnRequest.getAllColumns();
        // if there are no  columns yet create empty list
        if(joinedColumns == null){
            joinedColumns = new ArrayList<>();
        }
        List<JoinParameters> allJoinParameters = columnRequest.getAllJoinParameters();
        // if there are no join params yet create empty list
        if(allJoinParameters == null){
            allJoinParameters = new ArrayList<>();
        }
        List<String> joinedEntities = getJoinedEntities(allJoinParameters);
        //if there are no joined entities and some columns, add entity
        if(joinedEntities.size() == 0 && joinedColumns.size() > 0){
            joinedEntities.add(joinedColumns.get(0).getEntityName());
        }
        //change is add
        if(columnRequest.getAction() == 0) {
            List<Column> columns = columnRequest.getColumns();

            if (columns == null) {
                return new ColumnResponse(-1, null);
            }
            if (columns.size() == 0) {
                return new ColumnResponse(0, null);
            }
            boolean newJoin = false;
            String entityName = "";
            for (Column column : columns) {
                if (column == null) {
                    return new ColumnResponse(-1, null);
                }
                Entity entity = config.getEntities().get(column.getEntityName());
                if (entity == null) {
                    return new ColumnResponse(-1, null);
                }
                Property property = entity.getProperties().get(column.getPropertyName());
                if (property == null) {
                    return new ColumnResponse(-1, null);
                }
                if (!joinedEntities.contains(column.getEntityName())) {
                    newJoin = true;
                    entityName = column.getEntityName();
                }
                if (!joinedColumns.contains(column)) {
                    joinedColumns.add(column);
                }
            }
            if (!newJoin) {
                // entity already added, only add columns
                log.debug("ENTITY :" + columns.get(0).getEntityName() + " ADDED, ADDING COLUMNS");
                return new ColumnResponse(0, null);
            } else if (joinedEntities.size() == 0) {
                //first add
                joinedEntities.add(columns.get(0).getEntityName());
                log.debug("FIRST ADD ENTITY :" + columns.get(0).getEntityName());
                return new ColumnResponse(0, null);
            } else {
                // prepare join new entity
                JoinParameters joinParameters = new JoinParameters();
                List<List<String>> allPaths = new ArrayList<>();
                List<String> selectedPath = new ArrayList<>();
                List<List<ForeignKey>> allKeys = new ArrayList<>();
                List<ForeignKey> keys = new ArrayList<>();
                Entity start = config.getEntities().get(joinedEntities.get(joinedEntities.size() - 1));
                if (start.getReferredByMap().get(entityName) != null) {
                    {
                        keys.addAll(start.getReferredByMap().get(entityName));
                    }
                    if (start.getReferenceMap().get(entityName) != null) {
                        keys.addAll(start.getReferenceMap().get(entityName));
                    }
                    if (keys.size() > 0)
                        //direct join
                        selectedPath.add(start.getName());
                    selectedPath.add(entityName);
                    allPaths.add(selectedPath);
                    joinParameters.setPaths(allPaths);
                    joinParameters.setSelectedPath(selectedPath);
                    keys.sort(Comparator.comparingDouble(ForeignKey::getWeight));
                    //select first
                    keys.get(0).setSelected(true);
                    allKeys.add(keys);
                    joinParameters.setAllJoinColumns(allKeys);
                    //just one way to join, no need to dialog
                    if (keys.size() == 1) {
                        joinedEntities.add(entityName);
                        allJoinParameters.add(joinParameters);
                        log.debug("ENTITY :" + entityName + " DIRECT JOIN, ONE FK");
                        return new ColumnResponse(0, joinParameters);
                    } else {
                        //ask for dialog and specification on key
                        log.debug("ENTITY :" + entityName + " DIRECT JOIN, MULTIPLE FK");
                        return new ColumnResponse(1, joinParameters);
                    }

                }
                //joinedEntities.add(entityName);
                allPaths = getAllPaths(start, config.getEntities().get(entityName));
                if (allPaths == null || allPaths.size() == 0) {
                    //no path found
                    log.debug("ENTITY :" + entityName + " NO PATH FOUND FROM : " + start.getName());
                    return new ColumnResponse(10, null);
                }
                //at least one path found
                joinParameters.setPaths(allPaths);
                //priority one is the first
                selectedPath = allPaths.get(0);
                joinParameters.setSelectedPath(selectedPath);
                //browse selected path and prepare keys
                for (int i = 0; i < selectedPath.size() - 1; i++) {
                    start = config.getEntities().get(selectedPath.get(i));
                    String end = selectedPath.get(i + 1);
                    keys.clear();
                    if (start.getReferredByMap().get(end) != null) {
                        keys.addAll(start.getReferredByMap().get(end));
                    }
                    if (start.getReferenceMap().get(end) != null) {
                        keys.addAll(start.getReferenceMap().get(end));
                    }
                    keys.sort(Comparator.comparingDouble(ForeignKey::getWeight));
                    //select first
                    keys.get(0).setSelected(true);
                    allKeys.add(keys);
                }
                joinParameters.setAllJoinColumns(allKeys);
                //ask for dialog and specification on keys
                log.debug("ENTITY :" + entityName + " INDIRECT JOIN");
                return new ColumnResponse(1, joinParameters);
            }
        }else if(columnRequest.getAction() == 1){
            //TODO delete action
            return new ColumnResponse(1, null);
        } else{
            //error action
            return new ColumnResponse(-1, null);
        }
    }

    /**
     * Uses Dijktstra algorithm to find best path between tables
     * @param start starting table
     * @param end table we want join
     * @return list of tables to join
     */
    @Override
    public List<String> getPriorityPath(Entity start, Entity end){
        Set<String> visited =  new HashSet<>();
        Map<String, Node> heaped = new HashMap<>();
        visited.add(start.getName());
        Node currentNode = new Node(start.getName(), null, 0);
        heaped.put(currentNode.getName(), currentNode);
        PriorityQueue<Node> heap = new PriorityQueue<>();
        while(true){
            for(Edge edge : getEdges(currentNode.getName())){
                if(visited.contains(edge.getName())){
                    continue;
                }
                float newDistance = currentNode.getDistance() + edge.getWeight();
                Node temp = heaped.get(edge.getName());
                // not in heap yet
                if(temp == null){
                    temp = new Node(edge.getName(), currentNode.getName(), newDistance);
                    heaped.put(edge.getName(), temp);
                    heap.add(temp);
                //in heap and distance is bigger, do update
                }else if(temp.getDistance() > newDistance){
                    heap.remove(temp);
                    temp.setDistance(newDistance);
                    temp.setParent(currentNode.getName());
                    heap.add(temp);
                }
            }
            visited.add(currentNode.getName());
            if(heap.isEmpty()){
                log.info("NO PATH FOUND BETWEEN " + start.getName() + " " + end.getName());
                return null;
            }
            currentNode = heap.poll();
            //found path
            if(currentNode.getName().equals(end.getName())){
                break;
            }
        }
        //reconstruct
        List<String> path = new ArrayList<>();
        String name = currentNode.getName();
        while(name != null){
            path.add(name);
            name = heaped.get(name).getParent();
        }
        return path;
    }

    private Set<Edge> getEdges(String nodeName){
        Entity entity = config.getEntities().get(nodeName);
        Set<Edge> edges = new HashSet<>();
        if(entity == null){
            log.warn("ENTITY NOT FOUND IN CONFIG: " + nodeName);
            return  edges;
        }
        Set<String> references = entity.getReferenceMap().keySet();
        Set<String> referredBy = entity.getReferredByMap().keySet();
        Iterator<String> iterator = references.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            Entity e = config.getEntities().get(name);
            if(e != null){
                //TODO prioritize
                List<ForeignKey> keys = entity.getReferenceMap().get(name);
                if(keys != null && keys.size() > 0){
                    keys.sort(Comparator.comparingDouble(ForeignKey::getWeight));
                    edges.add(new Edge(name, keys.get(0).getWeight()));
                }else {
                    log.warn("ENTITY: " + nodeName + " REFERRED BY: " + name + " HAS NULL OR EMPTY FOREIGN KEY ");
                }
            }else{
                log.warn("REFERENCE NOT IN CONFIG: " + name + " REMOVING FROM CONFIG");
                iterator.remove();
            }
        }
        iterator = referredBy.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            Entity e = config.getEntities().get(name);
            if(e != null){
                //TODO prioritize
                List<ForeignKey> keys = entity.getReferredByMap().get(name);
                if(keys != null && keys.size() > 0){
                    keys.sort(Comparator.comparingDouble(ForeignKey::getWeight));
                    edges.add(new Edge(name, keys.get(0).getWeight()));
                }else {
                    log.warn("ENTITY: " + nodeName + " REFERRED BY: " + name + " HAS NULL OR EMPTY FOREIGN KEY ");
                }
            } else{
                log.warn("REFERRED BY NOT IN CONFIG: " + name + " REMOVING FROM CONFIG");
                iterator.remove();
            }
        }

        return edges;
    }

    @Override
    public List<List<String>> getAllPaths(Entity start, Entity end) {
        List<String> priorityPath = getPriorityPath(start, end);
        if(priorityPath == null){
            return null;
        }
        return findAllPathsBetween(start, end, priorityPath);
    }


    private List<List<String>> findAllPathsBetween(Entity start, Entity end, List<String> preferredPath){
        Stack<String> path = new Stack<>();
        Set<String> visited = new HashSet<>();
        List<List<String>> allPaths = new ArrayList<>();
        allPaths.add(preferredPath);
        modifiedDFS(start, end, preferredPath, path, visited, allPaths);
        return allPaths;
    }
    private void modifiedDFS(Entity tempStart, Entity end, List<String> preferredPath, Stack<String> path,Set<String> visited, List<List<String>> allPaths){
        // add node tempStart to current path from start
        path.push(tempStart.getName());
        visited.add(tempStart.getName());

        // found path from start to end
        if (tempStart.getName().equals(end.getName())) {
            log.info("PATH FOUND " + path.size() + " path " + path.toString());
            List<String> p = new ArrayList<>(path);
            if(!p.equals(preferredPath)){
                allPaths.add(p);
            }

        }
        // consider all neighbors that would continue path with repeating a node
        else {
            for (Entity neighbor : getNeighbors(config, tempStart)) {
                if (!path.contains(neighbor.getName()) && path.size() < preferredPath.size()+1){
                    modifiedDFS(neighbor, end, preferredPath, path, visited, allPaths);
                }
            }
        }
        // done exploring from tempStart, so remove from path
        path.pop();
        visited.remove(tempStart.getName());
    }

    private Set<Entity> getNeighbors(Config config, Entity entity){
        Set<Entity> neighbors = new HashSet<>();
        Set<String> references = entity.getReferenceMap().keySet();
        Set<String> referredBy = entity.getReferredByMap().keySet();
        Iterator<String> iterator = references.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            Entity e = config.getEntities().get(name);
            if(e != null){
                neighbors.add(e);
            }else{
                log.warn("REFERENCE NOT IN CONFIG: " + name + " REMOVING FROM CONFIG");
                iterator.remove();
            }
        }
        iterator = referredBy.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            Entity e = config.getEntities().get(name);
            if(e != null){
                neighbors.add(e);
            }else{
                log.warn("REFERRED BY NOT IN CONFIG: " + name + " REMOVING FROM CONFIG");
                iterator.remove();
            }
        }

        return neighbors;
    }

    /**
     * Creates joined entity list
     * @param joinParameters all current params
     * @return all joined entities
     */
    private List<String> getJoinedEntities(List<JoinParameters> joinParameters){
        List<String> joinedEntities = new ArrayList<>();
        for(JoinParameters params : joinParameters){
            for(String part : params.getSelectedPath()){
                if(!joinedEntities.contains(part)){
                    joinedEntities.add(part);
                }
            }
        }
        return joinedEntities;
    }

}
