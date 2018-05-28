package cz.zcu.fav.kiv.dobripet.reporting.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.CustomQuery;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto.CustomQueryRequest;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto.ErrorResponse;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto.SqlAndPreviewRequest;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto.SqlAndPreviewResponse;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto.PropertyStatistics;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto.RowCount;
import cz.zcu.fav.kiv.dobripet.reporting.service.BuilderService;
import cz.zcu.fav.kiv.dobripet.reporting.service.StatisticsService;
import cz.zcu.fav.kiv.dobripet.reporting.utils.InvalidDataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Defines whole application REST api
 *
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

    @GetMapping("/entities")
    public ResponseEntity<?> getEntities() throws JsonProcessingException {
        log.debug("GET ENTITIES");
        return ResponseEntity.ok(config.getEntities().values());
    }

    @GetMapping("/entities/{entityName}/stats/rowcount")
    public ResponseEntity<?> getEntityRowCount(@PathVariable String entityName) throws JsonProcessingException {
        RowCount rowCount = statisticsService.getEntityRowCount(entityName);
        log.debug("GET ENTITY: " + entityName + ", ROW COUNT: " + rowCount.getRowCount());
        return ResponseEntity.ok(rowCount);
    }

    @GetMapping("/entities/{entityName}/properties/{propertyName}/stats")
    public ResponseEntity<?> getPropertyStats(@PathVariable String entityName, @PathVariable String propertyName) throws JsonProcessingException {
        PropertyStatistics statistic = statisticsService.getStatistics(entityName, propertyName);
        log.debug("GET ENTITY: " + entityName + ", PROPERTY: " + propertyName + ", STATISTIC: " + statistic);
        if (statistic != null) {
            return ResponseEntity.ok(statistic);
        } else {
            return new ResponseEntity(HttpStatus.NO_CONTENT);
        }
    }

    @PostMapping("/builder/sqlandpreview")
    public ResponseEntity<?> getSqlAndPreview(@RequestBody SqlAndPreviewRequest sqlAndPreviewRequest) throws JsonProcessingException, InvalidDataException {
        SqlAndPreviewResponse response = builderService.getSqlAndPreview(sqlAndPreviewRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/builder/queries")
    public ResponseEntity<?> createNewQuery(@RequestBody CustomQueryRequest customQueryRequest) throws JsonProcessingException, InvalidDataException {
        CustomQuery customQuery = builderService.saveCustomQuery(customQueryRequest, null);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(customQuery.getId()).toUri();
        return ResponseEntity.created(location).body(customQuery);
    }

    @GetMapping("/builder/queries")
    public ResponseEntity<?> getAllQueries() {
        List<CustomQuery> customQueries = builderService.getAllCustomQueriesForCurrentUser();
        return ResponseEntity.ok(customQueries);
    }


    @PutMapping("/builder/queries/{id}")
    public ResponseEntity<?> saveQuery(@PathVariable int id, @RequestBody CustomQueryRequest customQueryRequest) throws JsonProcessingException, InvalidDataException {
        CustomQuery customQuery = builderService.saveCustomQuery(customQueryRequest, id);
        return ResponseEntity.ok().body(customQuery);
    }

    /**
     * Handles JsonProcessingException
     *
     * @param exception exception thrown by application
     * @return response with status code 500 and body with error message
     */
    @ExceptionHandler(value = {JsonProcessingException.class})
    protected ResponseEntity<?> handleParsingError(JsonProcessingException exception) {
        log.warn("FAILED TO PARSE OBJECT TO JSON", exception);
        ErrorResponse error = new ErrorResponse("Failed to parse object to JSON.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Bad request
     *
     * @param exception exception thrown by application
     * @return response with status code 400 and body with error message
     */
    @ExceptionHandler(value = {InvalidDataException.class})
    protected ResponseEntity<?> handleDataError(InvalidDataException exception) {
        log.warn("INVALID PARAMETERS OR DATA", exception);
        ErrorResponse error = new ErrorResponse("Invalid parameters or data.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }


}
