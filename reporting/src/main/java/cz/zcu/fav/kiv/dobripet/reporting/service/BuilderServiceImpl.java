package cz.zcu.fav.kiv.dobripet.reporting.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.fav.kiv.dobripet.reporting.dao.CustomQueryDAO;
import cz.zcu.fav.kiv.dobripet.reporting.dao.PreviewDAO;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.ForeignKey;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.*;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers.*;
import cz.zcu.fav.kiv.dobripet.reporting.utils.InvalidDataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service("builderService")
//@Scope(value = "session")
public class BuilderServiceImpl implements BuilderService {
    Logger log = LoggerFactory.getLogger(BuilderService.class);

    @Value("${dci.database.schemaName}")
    private String schemaName;

    private static ObjectMapper mapper = new ObjectMapper();

    private Config config;
    private PreviewDAO previewDAO;
    private CustomQueryDAO customQueryDAO;
    private UserService userService;

    private List<String> validJoinTypes = new ArrayList<>(Arrays.asList("INNER JOIN", "LEFT OUTER JOIN"));

    @Autowired
    public void setConfig(Config config) {
        this.config = config;
    }

    @Autowired
    public void setPreviewDAO(PreviewDAO previewDAO) {
        this.previewDAO = previewDAO;
    }

    @Autowired
    public void setCustomQueryDAO(CustomQueryDAO customQueryDAO) {
        this.customQueryDAO = customQueryDAO;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    @Transactional(value="reportingTransactionManager")
    @Override
    public List<CustomQuery> getAllCustomQueriesForCurrentUser() {
        int userID = userService.getCurrentUserId();
        return customQueryDAO.findAllByCreatedById(userID);
    }

    @Transactional(value="reportingTransactionManager")
    @Override
    public CustomQuery saveCustomQuery(CustomQueryRequest customQueryRequest, Integer id) throws InvalidDataException, JsonProcessingException{
        int userID = userService.getCurrentUserId();
        //validation
        validateColumns(customQueryRequest.getColumns());
        validateJoinParameters(customQueryRequest.getParameters());
        //setup state
        QueryParameters queryParameters = new QueryParameters();
        queryParameters.setColumns(customQueryRequest.getColumns());
        queryParameters.setParameters(customQueryRequest.getParameters());
        CustomQuery customQuery;
        if(id == null){
            //new save
            customQuery = new CustomQuery();
            customQuery.setQueryName(customQueryRequest.getQueryName());
            customQuery.setCreatedDate(LocalDateTime.now());
            customQuery.setCreatedById(userID);
        } else{
            //update current save
            customQuery = customQueryDAO.findOne(id);
            customQuery.setQueryName(customQueryRequest.getQueryName());
        }
        customQuery.setQueryParameters(mapper.writeValueAsString(queryParameters));
        customQuery.setUpdatedDate(LocalDateTime.now());
        customQuery.setUpdatedById(userID);
        customQuery.setValid(true);
        customQueryDAO.save(customQuery);
        System.out.println("POSAVE JE ID " + customQuery.getId());
        return customQuery;
    }

    @Transactional(value="dciTransactionManager")
    @Override
    public SqlAndPreviewResponse getSqlAndPreview(SqlAndPreviewRequest sqlAndPreviewRequest) throws InvalidDataException{
        validateColumns(sqlAndPreviewRequest.getColumns());
        validateJoinParameters(sqlAndPreviewRequest.getParameters());
        String sqlQuery;
        //no parameters, basic select
        if(sqlAndPreviewRequest.getParameters() == null || sqlAndPreviewRequest.getParameters().size() == 0){
            sqlQuery = createBasicStringSelect(sqlAndPreviewRequest.getColumns());
        } else {
            //select with joins
            sqlQuery = createJoinStringSelect(sqlAndPreviewRequest.getColumns(), sqlAndPreviewRequest.getParameters());
        }
        System.out.println("toz dostal jsem se pres validaci " + sqlQuery);
        SqlAndPreviewResponse sqlAndPreviewResponse = new SqlAndPreviewResponse();
        sqlAndPreviewResponse.setPreviewData(previewDAO.getPreviewForStringQuery(sqlQuery));
        sqlAndPreviewResponse.setSqlQuery(sqlQuery);
        return sqlAndPreviewResponse;
    }

    private String createONFromJoinKeys(List<ForeignKey> joinKeys, String local, String foreign){
        StringBuilder on = new StringBuilder();
        on.append("\nON (");
        StringJoiner sj = new StringJoiner(" AND ");
        for(ForeignKey key : joinKeys){
            if(key.isSelected()){
                sj.add(local+"."+key.getLocalColumnName()+" = "+foreign+"."+key.getForeignColumnName());
            }
        }
        on.append(sj.toString());
        on.append(" )");
        return on.toString();
    }

    private String createBasicStringSelect(List<Column> columns){
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT ");
        String entityName = columns.get(0).getEntityName();
        //table alias
        String alias = entityName.substring(0,1).toLowerCase();
        StringJoiner aliases = new StringJoiner(", ");
        Map<String, Integer> titles = new HashMap<>();
        for(Column column : columns){
            String title = column.getTitle();
            //create unique column aliases, needed for hibernate query
            if(titles.containsKey(title)){
                titles.put(title,titles.get(title)+1);
                title = title+titles.get(title);
            }else{
                titles.put(title,0);
            }
            //aliases ex. b.Scrap_Factor AS 'BOM Scrap_Factor'
            aliases.add(alias+"."+column.getPropertyName()+" AS '"+title+"'");
        }
        sb.append(aliases.toString());
        //ex FROM dciowner.BOM as b
        sb.append(" FROM "+schemaName+"."+entityName+" " + alias + ";");
        return sb.toString();
    }

    public void updateEntityAliases(Map<String,String> entityAliases, String entityName){
        if(!entityAliases.containsKey(entityName)){
            int j = 1;
            int k = 0;
            String entityAlias = entityName.substring(0, j).toLowerCase();
            while(entityAliases.values().contains(entityAlias)){
                j++;
                //if alias is whole table name, add numbers, should not happened
                if(j < entityName.length()) {
                    entityAlias = entityName.substring(0, j).toLowerCase();
                } else {
                    k++;
                    entityAlias = entityName + k;
                }
            }
            entityAliases.put(entityName, entityAlias);
        }
    }

    private String createJoinStringSelect(List<Column> columns, List<JoinParameters> joinParameters){
        StringBuilder sb = new StringBuilder();
        Map<String, String> entityAliases = new HashMap<>();
        Map<String, Integer> titles = new HashMap<>();
        StringJoiner aliases = new StringJoiner(", ");
        //prepare joins
        StringBuilder joins = new StringBuilder();
        for(int x = 0; x <  joinParameters.size(); x++){
            JoinParameters parameters = joinParameters.get(x);
            for(int i = 0; i <  parameters.getSelectedPath().size()-1; i++){
                String entityName = parameters.getSelectedPath().get(i);
                String targetEntityName = parameters.getSelectedPath().get(i+1);
                //create unique table aliases
                updateEntityAliases(entityAliases, entityName);
                updateEntityAliases(entityAliases, targetEntityName);
                //first entity is FROM
                if(x == 0 && i == 0){
                    joins.append("\nFROM "+schemaName+"."+entityName+" " + entityAliases.get(entityName));
                }
                //JOIN and ON
                joins.append("\n"+parameters.getJoinTypes().get(i)+" "+schemaName+"."+targetEntityName+" " + entityAliases.get(targetEntityName));
                joins.append(createONFromJoinKeys(parameters.getJoinKeys().get(i), entityAliases.get(entityName), entityAliases.get(targetEntityName)));
            }
        }
        //prepare select columns
        for(Column column : columns){
            String title = column.getTitle();
            //create unique column aliases, needed for hibernate query
            if(titles.containsKey(title)){
                titles.put(title,titles.get(title)+1);
                title = title+titles.get(title);
            }else{
                titles.put(title,0);
            }

            //aliases ex. b.Scrap_Factor AS 'BOM Scrap_Factor'
            aliases.add(entityAliases.get(column.getEntityName())+"."+column.getPropertyName()+" AS '"+title+"'");
        }
        sb.append("SELECT ");
        sb.append(aliases.toString());
        sb.append(joins.toString());
        sb.append(";");
        return sb.toString();
    }

    private void validateColumns(List<Column> columns) throws InvalidDataException{
        //needs to have something to display
        if(columns == null || columns.size() == 0){
            throw new InvalidDataException();
        }
        //Set<String> titles = new HashSet<>();
        //validate to configuration
        for(Column column : columns){
            Entity entity = config.getEntities().get(column.getEntityName());
            if (entity == null) {
                throw new InvalidDataException();
            }
            Property property = entity.getProperties().get(column.getPropertyName());
            if (property == null) {
                throw new InvalidDataException();
            }
            //TODO overit zda skutecne musi nebo ne
            /*if(titles.contains(column.getTitle())){
                throw new InvalidDataException();
            }*/
        }
    }

    /**
     * Helper function to get all keys for neighbor tables
     * @param start first table name
     * @param end second table name
     * @return all foreign keys from configuration
     */
    private List<ForeignKey> getAllKeysFromConfigForJoin(String start, String end) {
        List<ForeignKey> configKeys = new ArrayList<>();
        if(config.getEntities().get(start).getReferredByMap().get(end)!= null){
            configKeys.addAll(config.getEntities().get(start).getReferredByMap().get(end));
        }
        if(config.getEntities().get(start).getReferenceMap().get(end) != null) {
            configKeys.addAll(config.getEntities().get(start).getReferenceMap().get(end));
        }
        return configKeys;
    }

    private void validateJoinParameters(List<JoinParameters> joinParameters) throws InvalidDataException{
        //can be null, then just pure select on columns
        if(joinParameters != null && joinParameters.size() > 0){
            for(JoinParameters parameters : joinParameters){
                //has to have selected path
                if(parameters.getSelectedPath() == null || parameters.getSelectedPath().size() < 2){
                    throw new InvalidDataException();
                }
                //has to have join keys and has to correspond to selectedPath
                if(parameters.getJoinKeys() == null || parameters.getJoinKeys().size() != parameters.getSelectedPath().size()-1){
                    throw new InvalidDataException();
                }
                //has to have join types and has to correspond to selectedPath
                if(parameters.getJoinTypes() == null || parameters.getJoinTypes().size() != parameters.getSelectedPath().size()-1){
                    throw new InvalidDataException();
                }
                //join keys for every path part to config validation
                for(int i = 0; i < parameters.getSelectedPath().size()-1; i++){
                    for(ForeignKey key : parameters.getJoinKeys().get(i)){
                        //only selected keys are used
                        if(key.isSelected()) {
                            boolean found = false;
                            //browse config keys and try to find match
                            for(ForeignKey configKey : getAllKeysFromConfigForJoin(parameters.getSelectedPath().get(i), parameters.getSelectedPath().get(i+1))) {
                                if(configKey.getForeignColumnName().equals(key.getForeignColumnName()) && configKey.getLocalColumnName().equals(key.getLocalColumnName())) {
                                    found = true;
                                    break;
                                }
                            }
                            //if no match found, key is invalid
                            if(!found) {
                                throw new InvalidDataException();
                            }
                        }
                    }
                }
                //check validity of join types
                for(String key : parameters.getJoinTypes()){
                    if(!validJoinTypes.contains(key)){
                        throw new InvalidDataException();
                    }
                }

            }
        }
    }

    @Override
    public ColumnResponse getJoinFromColumns(ColumnRequest columnRequest) throws InvalidDataException{

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
        List<Column> columns = columnRequest.getColumns();
        if (columns == null || columns.size() == 0) {
            //there are no columns in request to work with
            throw new InvalidDataException();
        }
        //change is add
        boolean registerChange = false;
        String entityName = "";
        for (Column column : columns) {
            //check data validity
            if (column == null) {
                throw new InvalidDataException();
            }
            Entity entity = config.getEntities().get(column.getEntityName());
            if (entity == null) {
                throw new InvalidDataException();
            }
            Property property = entity.getProperties().get(column.getPropertyName());
            if (property == null) {
                throw new InvalidDataException();
            }
            if(columnRequest.getAction() == 0) {
                if (!joinedEntities.contains(column.getEntityName())) {
                    registerChange = true;
                    entityName = column.getEntityName();
                }
                if (!joinedColumns.contains(column)) {
                    joinedColumns.add(column);
                }
            } else{
                if (joinedEntities.contains(column.getEntityName())) {
                    registerChange = true;
                    entityName = column.getEntityName();
                }
                if (joinedColumns.contains(column)) {
                    joinedColumns.remove(column);
                }
            }
        }
        if(columnRequest.getAction() == 0) {
            if (!registerChange) {
                // entity already added, only add columns
                log.debug("ENTITY :" + columns.get(0).getEntityName() + " ADDED, ADDING COLUMNS");
                return new ColumnResponse(0, allJoinParameters);
            } else if (joinedEntities.size() == 0) {
                //first add
                joinedEntities.add(columns.get(0).getEntityName());
                log.debug("FIRST ADD ENTITY :" + columns.get(0).getEntityName());
                return new ColumnResponse(0, allJoinParameters);
            } else {
                // prepare join new entity
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
        }else if(columnRequest.getAction() == 1){
            if(joinedEntities.contains(entityName)) {
                //change is delete
                if (registerChange) {
                    Iterator<JoinParameters> iterator = allJoinParameters.iterator();
                    boolean shouldRemoveOnwards = false;
                    //check if path ends on removed entity
                    while (iterator.hasNext()) {
                        JoinParameters joinParameters = iterator.next();
                        if (joinParameters.getSelectedPath().get(joinParameters.getSelectedPath().size() - 1).equals(entityName)) {
                            shouldRemoveOnwards = true;
                        }
                        if (shouldRemoveOnwards) {
                            iterator.remove();
                        }
                    }
                    //check removed entity is first
                    if (allJoinParameters.get(0).getSelectedPath().get(0).equals(entityName)){
                        //removeAllColumnsFromJoinParameters(allJoinParameters.get(0));
                        allJoinParameters.remove(0);
                    }
                    iterator = allJoinParameters.iterator();
                }
                else{
                    //want to delete column but column is not joined
                    throw new InvalidDataException();
                }
            } else {
                //want to delete entity but entity is not joined
                throw new InvalidDataException();
            }
            return new ColumnResponse(1, null);
        } else{
            //error action
            throw new InvalidDataException();
        }
    }

    @Override
    public List<List<ForeignKey>> getJoinKeysFromPath(List<String> path) {
        List<List<ForeignKey>> allKeys = new ArrayList<>();
        Entity start;
        for (int i = 0; i < path.size() - 1; i++) {
            start = config.getEntities().get(path.get(i));
            String end = path.get(i + 1);
            List<ForeignKey> keys = new ArrayList<>();
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
        return allKeys;
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
        Collections.reverse(path);
        log.debug("SHORTEST PATH " + path.toString());
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
                if (visited.contains(neighbor.getName()) && path.size() < preferredPath.size()+1){
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
    private List<String> getJoinedEntities(List<JoinParameters> joinParameters) throws InvalidDataException{
        List<String> joinedEntities = new ArrayList<>();
        for(JoinParameters params : joinParameters){
            //data validity check
            if(params.getSelectedPath() == null || params.getSelectedPath().size() < 2){
                throw new InvalidDataException();
            }
            for(String part : params.getSelectedPath()){
                if(!joinedEntities.contains(part)){
                    joinedEntities.add(part);
                }
            }
        }
        return joinedEntities;
    }

}
