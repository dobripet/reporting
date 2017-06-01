package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import javax.transaction.Transactional;
import java.util.HashMap;

/**
 * Created by Petr on 4/27/2017.
 */
public class ReportingInitializer{
    @Autowired
    private ConfigValidator configValidator;

    @Autowired
    private Config config;

    @Autowired
    private StatisticsService statisticsService;

    @Value("${dci.documentation.url}")
    String documentationUrl;

    /**
     * Watches for changes in root context
     * Validates config to current database.
     * Initialize statistics
     * @param event
     */
    @EventListener()
    @Transactional
    public void contextRefreshedEvent(ContextRefreshedEvent event){
        if(event.getApplicationContext().getParent() == null) {
            System.out.println("stats " + statisticsService);
            //init or clear paths
            config.setPaths(new HashMap<>());
            //init uris
            config.initializeDocumentationUrl(documentationUrl);
            //do validation to database
            configValidator.validate();
            //init statistics
            statisticsService.init();
        }
    }
}
