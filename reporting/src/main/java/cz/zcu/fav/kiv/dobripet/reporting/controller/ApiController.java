package cz.zcu.fav.kiv.dobripet.reporting.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.CustomQuery;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers.CustomQueryRequest;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers.SqlAndPreviewRequest;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers.SqlAndPreviewResponse;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.PropertyStatistics;
import cz.zcu.fav.kiv.dobripet.reporting.service.BuilderService;
import cz.zcu.fav.kiv.dobripet.reporting.service.StatisticsService;
import cz.zcu.fav.kiv.dobripet.reporting.utils.InvalidDataException;
import cz.zcu.fav.kiv.dobripet.reporting.utils.JSONWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.util.List;

/**
 * Created by Petr on 3/4/2017.
 */
@RestController
@RequestMapping(value = "/api")
public class ApiController {

    private Logger log = LoggerFactory.getLogger(ApiController.class);

    private StatisticsService statisticsService;

    private Config config;

    private BuilderService builderService;

    @Autowired
    public void setStatisticsService(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @Autowired
    public void setConfig(Config config) {
        this.config = config;
    }

    @Autowired
    public void setBuilderService(BuilderService builderService) {
        this.builderService = builderService;
    }

    /**
     * Updates config with current documentation root URL.
     * Initialize statistics.
     */
    @PostConstruct
    private void InitConfig(){
        System.out.println("bean stat " +statisticsService);
    }

    //@CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities")
    public ResponseEntity<?> getEntities() throws JsonProcessingException {
        log.debug("GET ENTITIES");
        return ResponseEntity.ok(config.getEntities().values());
        //throw new JsonGenerationException("");
        //return JSONWrapper.wrapObjectToString("entities", );
    }
    //@CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities/{entityName}/stats/rowcount")
    public ResponseEntity<?>  getEntityRowCount(@PathVariable String entityName) throws JsonProcessingException {
        long rowCount = statisticsService.getEntityRowCount(entityName);
        log.debug("GET ENTITY: "+entityName+", ROW COUNT: " +rowCount);
        return ResponseEntity.ok("{\"rowCount\":"+rowCount+"}");
        //return JSONWrapper.wrapObjectToString("rowCount", rowCount);
    }

    //@CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities/{entityName}/properties/{propertyName}/stats")
    public ResponseEntity<?> getPropertyStats(@PathVariable String entityName, @PathVariable String propertyName) throws JsonProcessingException {
        PropertyStatistics statistic = statisticsService.getStatistics(entityName, propertyName);
        log.debug("GET ENTITY: "+entityName+", PROPERTY: " + propertyName + ", STATISTIC: " + statistic);
        return ResponseEntity.ok(statistic);
        //return JSONWrapper.wrapObjectToString("statistic", statistic);
    }
/*
    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/builder/columns")
    public String getJoinFromColumns(@RequestBody ColumnRequest columnRequest) throws JsonProcessingException, InvalidDataException {
        for(Column c : columnRequest.getColumns()){
            System.out.println(c);
        }
        ColumnResponse columnResponse = builderService.getJoinFromColumns(columnRequest);
        return JSONWrapper.wrapObjectToString("builder", columnResponse);
    }
    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/builder/joinkeys")
    public String getJoinKeysFromPath(@RequestBody List<String> path) throws JsonProcessingException, InvalidDataException {
        for(String c : path){
            System.out.println(c);
        }
        List<List<ForeignKey>> joinKeys = builderService.getJoinKeysFromPath(path);
        return JSONWrapper.wrapObjectToString("joinKeys", joinKeys);
    }*/
    //@CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/builder/sqlandpreview")
    public ResponseEntity<?> getSqlAndPreview(@RequestBody SqlAndPreviewRequest sqlAndPreviewRequest) throws JsonProcessingException, InvalidDataException {
        SqlAndPreviewResponse response = builderService.getSqlAndPreview(sqlAndPreviewRequest);
        return ResponseEntity.ok(response);
        //return JSONWrapper.wrapObjectToString("sqlAndPreview", response);
    }

    //@CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/builder/queries")
    public ResponseEntity<?> createNewQuery(@RequestBody CustomQueryRequest customQueryRequest) throws JsonProcessingException, InvalidDataException {
        CustomQuery customQuery = builderService.saveCustomQuery(customQueryRequest, null);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(customQuery.getId()).toUri();
        return ResponseEntity.created(location).body(customQuery);
        //return JSONWrapper.wrapObjectToString("id", id);
    }
    @GetMapping("/builder/queries")
    public ResponseEntity<?> getAllQueries(){
        List<CustomQuery> customQueries = builderService.getAllCustomQueriesForCurrentUser();
        return ResponseEntity.ok(customQueries);
        //return JSONWrapper.wrapObjectToString("id", id);
    }
    //@CrossOrigin(origins = "http://localhost:8080")
    @PutMapping("/builder/queries/{id}")
    public ResponseEntity<?> saveQuery(@PathVariable int id, @RequestBody CustomQueryRequest customQueryRequest) throws JsonProcessingException, InvalidDataException {
        CustomQuery customQuery = builderService.saveCustomQuery(customQueryRequest, id);
        return ResponseEntity.ok().body(customQuery);
        //return JSONWrapper.wrapObjectToString("id", id);
    }
    /**
     * Handles JsonProcessingException
     * @param exception exception thrown by application
     * @return response with status code 500 and body with error message
     */
    @ExceptionHandler(value = {JsonProcessingException.class})
    protected ResponseEntity<String> handleParsingError(JsonProcessingException exception){
        log.warn("FAILED TO PARSE OBJECT TO JSON", exception);
        String body = "{\"error\":\"Failed to parse object to JSON.\"}";
        return new ResponseEntity<String>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Bad request
     * @param exception exception thrown by application
     * @return response with status code 400 and body with error message
     */
    @ExceptionHandler(value = {InvalidDataException.class})
    protected ResponseEntity<String> handleDataError(InvalidDataException exception){
        log.warn("INVALID PARAMETERS OR DATA", exception);
        String body = "{\"error\":\"Invalid parameters or data.\"}";
        return new ResponseEntity<String>(body, HttpStatus.BAD_REQUEST);
    }



}
