package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.Transactional;

/**
 * Initialization for reporting web-module
 *
 * Created by Petr on 4/27/2017.
 */
public class ReportingInitializer{
    @Value("${dci.documentation.url}")
    String documentationUrl;

    private ConfigValidator configValidator;

    private Config config;

    private StatisticsService statisticsService;

    @Autowired
    public void setConfigValidator(ConfigValidator configValidator) {
        this.configValidator = configValidator;
    }

    @Autowired
    public void setConfig(Config config) {
        this.config = config;
    }

    @Autowired
    public void setStatisticsService(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    /**
     * Watches for changes in root context
     * Validates config to current database.
     * Initialize statistics
     * @param event refresh
     */
    @EventListener()
    @Transactional("dciTransactionManager")
    public void contextRefreshedEvent(ContextRefreshedEvent event){
        if(event.getApplicationContext().getParent() == null) {
            //do validation to database
            configValidator.validate();
            //init uris
            config.initializeDocumentationUrl(documentationUrl);
            //init statistics
            statisticsService.init();
        }
    }
}
