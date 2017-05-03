package cz.zcu.fav.kiv.dobripet.reporting.controller;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.fav.kiv.dobripet.reporting.configuration.ConfigValidator;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.PropertyStatistics;
import cz.zcu.fav.kiv.dobripet.reporting.service.StatisticsService;
import cz.zcu.fav.kiv.dobripet.reporting.utils.JSONWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.annotation.PostConstruct;
import java.io.IOException;

/**
 * Created by Petr on 3/4/2017.
 */
@RestController
@RequestMapping(value = "/api")
public class ApiController {
    private Logger log = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private StatisticsService statisticsService;


    @Autowired
    private Config config;


    /**
     * Updates config with current documentation root URL.
     * Initialize statistics.
     */
    @PostConstruct
    private void InitConfig(){
        System.out.println("bean stat " +statisticsService);
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/test")
    public String getApi(){
        System.out.println("necoprislo");
        return "{\"asdasd\": 15}";
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities")
    public String getEntities() throws JsonProcessingException {
        log.debug("GET ENTITIES");
        //throw new JsonGenerationException("");
        return JSONWrapper.wrapObjectToString("entities", config.getEntities());
    }
    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities/{entityName}/stats/rowcount")
    public String getEntityRowCount(@PathVariable String entityName) throws JsonProcessingException {
        long rowCount = statisticsService.getEntityRowCount(entityName);
        log.debug("GET ENTITY: "+entityName+", ROW COUNT: " +rowCount);
        return JSONWrapper.wrapObjectToString("rowCount", rowCount);
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities/{entityName}/properties/{propertyName}/stats")
    public String getPropertyStats(@PathVariable String entityName, @PathVariable String propertyName) throws JsonProcessingException {
        PropertyStatistics statistic = statisticsService.getStatistics(entityName, propertyName);
        log.debug("GET ENTITY: "+entityName+", PROPERTY: " + propertyName + ", STATISTIC: " + statistic);
        return JSONWrapper.wrapObjectToString("statistic", statistic);
    }

    /**
     * Handles JsonProcessingException
     * @param exception exception thrown by application
     * @return response with status code 500 and body with error message
     */
    @ExceptionHandler(value = {JsonProcessingException.class})
    protected ResponseEntity<String> handeParsingError(JsonProcessingException exception){
        log.warn("FAILED TO PARSE OBJECT TO JSON", exception);
        String body = "{\"error\":\"Failed to parse object to JSON.\"}";
        return new ResponseEntity<String>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
