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
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto.*;
import cz.zcu.fav.kiv.dobripet.reporting.utils.InvalidDataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service operates with builder part or application
 * Contains query validation, generation and preview retrieval
 * Operations with CustomerQuery
 *
 * Created by Petr on 5/24/2017.
 */
@Service("builderService")
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


    @Transactional(value = "reportingTransactionManager")
    @Override
    public List<CustomQuery> getAllCustomQueriesForCurrentUser() {
        int userID = userService.getCurrentUserId();
        return customQueryDAO.findAllByCreatedById(userID);
    }

    @Transactional(value = "reportingTransactionManager")
    @Override
    public CustomQuery saveCustomQuery(CustomQueryRequest customQueryRequest, Integer id) throws InvalidDataException, JsonProcessingException {
        int userID = userService.getCurrentUserId();
        //validation
        validateColumns(customQueryRequest.getColumns());
        validateJoinParameters(customQueryRequest.getParameters());
        //setup state
        QueryParameters queryParameters = new QueryParameters();
        queryParameters.setColumns(customQueryRequest.getColumns());
        queryParameters.setParameters(customQueryRequest.getParameters());
        CustomQuery customQuery;
        if (id == null) {
            //new save
            customQuery = new CustomQuery();
            customQuery.setQueryName(customQueryRequest.getQueryName());
            customQuery.setCreatedDate(LocalDateTime.now());
            customQuery.setCreatedById(userID);
        } else {
            //update current save
            customQuery = customQueryDAO.findOne(id);
            customQuery.setQueryName(customQueryRequest.getQueryName());
        }
        customQuery.setQueryParameters(mapper.writeValueAsString(queryParameters));
        customQuery.setUpdatedDate(LocalDateTime.now());
        customQuery.setUpdatedById(userID);
        customQuery.setValid(true);
        customQueryDAO.save(customQuery);
        return customQuery;
    }

    @Transactional(value = "dciTransactionManager")
    @Override
    public SqlAndPreviewResponse getSqlAndPreview(SqlAndPreviewRequest sqlAndPreviewRequest) throws InvalidDataException {
        validateColumns(sqlAndPreviewRequest.getColumns());
        validateJoinParameters(sqlAndPreviewRequest.getParameters());
        String sqlQuery;
        //no parameters, basic select
        if (sqlAndPreviewRequest.getParameters() == null || sqlAndPreviewRequest.getParameters().size() == 0) {
            sqlQuery = createBasicStringSelect(sqlAndPreviewRequest.getColumns());
        } else {
            //select with joins
            sqlQuery = createJoinStringSelect(sqlAndPreviewRequest.getColumns(), sqlAndPreviewRequest.getParameters());
        }
        SqlAndPreviewResponse sqlAndPreviewResponse = new SqlAndPreviewResponse();
        sqlAndPreviewResponse.setPreviewData(previewDAO.getPreviewForStringQuery(sqlQuery));
        sqlAndPreviewResponse.setSqlQuery(sqlQuery);
        return sqlAndPreviewResponse;
    }

    private String createONFromJoinKeys(List<ForeignKey> joinKeys, String local, String foreign) {
        StringBuilder on = new StringBuilder();
        on.append("\nON (");
        StringJoiner sj = new StringJoiner(" AND ");
        for (ForeignKey key : joinKeys) {
            if (key.isSelected()) {
                sj.add(local + "." + key.getLocalColumnName() + " = " + foreign + "." + key.getForeignColumnName());
            }
        }
        on.append(sj.toString());
        on.append(" )");
        return on.toString();
    }

    private String createBasicStringSelect(List<Column> columns) {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT ");
        String entityName = columns.get(0).getEntityName();
        //table alias
        String alias = entityName.substring(0, 1).toLowerCase();
        StringJoiner aliases = new StringJoiner(", ");
        Map<String, Integer> titles = new HashMap<>();
        for (Column column : columns) {
            String title = column.getTitle();
            //create unique column aliases, needed for hibernate query
            if (titles.containsKey(title)) {
                titles.put(title, titles.get(title) + 1);
                title = title + titles.get(title);
            } else {
                titles.put(title, 0);
            }
            //aliases ex. b.Scrap_Factor AS 'BOM Scrap_Factor'
            aliases.add(alias + "." + column.getPropertyName() + " AS '" + title + "'");
        }
        sb.append(aliases.toString());
        //ex FROM dciowner.BOM as b
        sb.append(" FROM " + schemaName + "." + entityName + " " + alias + ";");
        return sb.toString();
    }

    private boolean createdEntityAlias(Map<String, String> entityAliases, String entityName) {
        if (!entityAliases.containsKey(entityName)) {
            int j = 1;
            int k = 0;
            String entityAlias = entityName.substring(0, j).toLowerCase();
            while (entityAliases.values().contains(entityAlias)) {
                j++;
                //if alias is whole table name, add numbers, should not happened
                if (j < entityName.length()) {
                    entityAlias = entityName.substring(0, j).toLowerCase();
                } else {
                    k++;
                    entityAlias = entityName + k;
                }
            }
            entityAliases.put(entityName, entityAlias);
            return true;
        } else {
            return false;
        }
    }

    private int browseChildren(List<JoinParameters> joinParameters, Map<String, String> entityAliases, int index, StringBuilder joins, boolean first) {
        addToJoin(joinParameters.get(index), entityAliases, joins, first);
        String entityEnd = joinParameters.get(index).getSelectedPath().get(joinParameters.get(index).getSelectedPath().size() - 1);
        int count = 0;
        for (int i = 0; i < joinParameters.size(); i++) {
            //find children
            if (entityEnd.equals(joinParameters.get(i).getSelectedPath().get(0))) {
                StringBuilder tmpJoins = new StringBuilder();
                browseChildren(joinParameters, entityAliases, i, tmpJoins, false);
                joins.append(tmpJoins.toString());
                count++;
            }
        }
        return count;
    }


    private void addToJoin(JoinParameters parameters, Map<String, String> entityAliases, StringBuilder joins, boolean first) {
        for (int i = 0; i < parameters.getSelectedPath().size() - 1; i++) {
            String entityName = parameters.getSelectedPath().get(i);
            String targetEntityName = parameters.getSelectedPath().get(i + 1);
            //create unique table aliases
            createdEntityAlias(entityAliases, entityName);
            //table is already joined
            if (!createdEntityAlias(entityAliases, targetEntityName)) {
                continue;
            }
            //first entity is FROM
            if (first && i == 0) {
                joins.append("\nFROM " + schemaName + "." + entityName + " " + entityAliases.get(entityName));
            }
            //JOIN and ON
            joins.append("\n" + parameters.getJoinTypes().get(i) + " " + schemaName + "." + targetEntityName + " " + entityAliases.get(targetEntityName));
            joins.append(createONFromJoinKeys(parameters.getJoinKeys().get(i), entityAliases.get(entityName), entityAliases.get(targetEntityName)));
        }
    }

    private String createJoinStringSelect(List<Column> columns, List<JoinParameters> joinParameters) {
        StringBuilder sb = new StringBuilder();
        Map<String, String> entityAliases = new HashMap<>();
        Map<String, Integer> titles = new HashMap<>();
        StringJoiner aliases = new StringJoiner(",\n");
        //prepare joins
        StringBuilder joins = new StringBuilder();
        //create tree from join parameters
        boolean first = true;
        for (int i = 0; i < joinParameters.size(); i++) {
            int parent = -1;
            String entityName = joinParameters.get(i).getSelectedPath().get(0);
            for (int y = 0; y < joinParameters.size(); y++) {
                if (entityName.equals(joinParameters.get(y).getSelectedPath().get(joinParameters.get(y).getSelectedPath().size() - 1))) {
                    parent = y;
                }
            }
            //root, browse recursively
            if (parent == -1) {
                StringBuilder tmpJoins = new StringBuilder();
                browseChildren(joinParameters, entityAliases, i, tmpJoins, first);
                //append to whole join, if there are no children, tmpJoin will be empty String
                joins.append(tmpJoins.toString());
                if (first) {
                    first = false;
                }
            }
        }
        //prepare select columns
        for (Column column : columns) {
            String title = column.getTitle();
            //create unique column aliases, needed for hibernate query
            if (titles.containsKey(title)) {
                titles.put(title, titles.get(title) + 1);
                title = title + titles.get(title);
            } else {
                titles.put(title, 0);
            }

            //aliases ex. b.Scrap_Factor AS 'BOM Scrap_Factor'
            aliases.add(entityAliases.get(column.getEntityName()) + "." + column.getPropertyName() + " AS '" + title + "'");
        }
        sb.append("SELECT ");
        sb.append(aliases.toString());
        sb.append(joins.toString());
        sb.append(";");
        return sb.toString();
    }

    private void validateColumns(List<Column> columns) throws InvalidDataException {
        //needs to have something to display
        if (columns == null || columns.size() == 0) {
            throw new InvalidDataException();
        }
        //validate to configuration
        for (Column column : columns) {
            Entity entity = config.getEntities().get(column.getEntityName());
            if (entity == null) {
                throw new InvalidDataException();
            }
            Property property = entity.getProperties().get(column.getPropertyName());
            if (property == null) {
                throw new InvalidDataException();
            }
        }
    }

    /**
     * Helper function to get all keys for neighbor tables
     *
     * @param start first table name
     * @param end   second table name
     * @return all foreign keys from configuration
     */
    private List<ForeignKey> getAllKeysFromConfigForJoin(String start, String end) {
        List<ForeignKey> configKeys = new ArrayList<>();
        if (config.getEntities().get(start).getReferredByMap().get(end) != null) {
            configKeys.addAll(config.getEntities().get(start).getReferredByMap().get(end));
        }
        if (config.getEntities().get(start).getReferenceMap().get(end) != null) {
            configKeys.addAll(config.getEntities().get(start).getReferenceMap().get(end));
        }
        return configKeys;
    }

    private void validateJoinParameters(List<JoinParameters> joinParameters) throws InvalidDataException {
        //can be null, then just pure select on columns
        if (joinParameters != null && joinParameters.size() > 0) {
            for (JoinParameters parameters : joinParameters) {
                //has to have selected path
                if (parameters.getSelectedPath() == null || parameters.getSelectedPath().size() < 2) {
                    throw new InvalidDataException();
                }
                //has to have join keys and has to correspond to selectedPath
                if (parameters.getJoinKeys() == null || parameters.getJoinKeys().size() != parameters.getSelectedPath().size() - 1) {
                    throw new InvalidDataException();
                }
                //has to have join types and has to correspond to selectedPath
                if (parameters.getJoinTypes() == null || parameters.getJoinTypes().size() != parameters.getSelectedPath().size() - 1) {
                    throw new InvalidDataException();
                }
                //join keys for every path part to config validation
                for (int i = 0; i < parameters.getSelectedPath().size() - 1; i++) {
                    for (ForeignKey key : parameters.getJoinKeys().get(i)) {
                        //only selected keys are used
                        if (key.isSelected()) {
                            boolean found = false;
                            //browse config keys and try to find match
                            for (ForeignKey configKey : getAllKeysFromConfigForJoin(parameters.getSelectedPath().get(i), parameters.getSelectedPath().get(i + 1))) {
                                if (configKey.getForeignColumnName().equals(key.getForeignColumnName()) && configKey.getLocalColumnName().equals(key.getLocalColumnName())) {
                                    found = true;
                                    break;
                                }
                            }
                            //if no match found, key is invalid
                            if (!found) {
                                throw new InvalidDataException();
                            }
                        }
                    }
                }
                //check validity of join types
                for (String key : parameters.getJoinTypes()) {
                    if (!validJoinTypes.contains(key)) {
                        throw new InvalidDataException();
                    }
                }

            }
        }
    }
}
