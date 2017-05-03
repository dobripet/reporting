package cz.zcu.fav.kiv.dobripet.reporting.service;

import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.PropertyStatistics;

/**
 * Created by Petr on 4/21/2017.
 */
public interface StatisticsService {
    long getEntityRowCount(String entityName);
    void init();
    PropertyStatistics getStatistics(String entityName, String propertyName);

}
