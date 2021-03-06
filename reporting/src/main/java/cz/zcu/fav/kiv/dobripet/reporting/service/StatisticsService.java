package cz.zcu.fav.kiv.dobripet.reporting.service;

import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto.PropertyStatistics;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto.RowCount;

/**
 * Created by Petr on 4/21/2017.
 */
public interface StatisticsService {
    RowCount getEntityRowCount(String entityName);
    void init();
    PropertyStatistics getStatistics(String entityName, String propertyName);

}
