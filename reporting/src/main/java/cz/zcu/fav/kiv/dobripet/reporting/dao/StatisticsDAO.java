package cz.zcu.fav.kiv.dobripet.reporting.dao;

import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.ConstraintQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticHeaderQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticsQueryRow;

import java.util.List;

/**
 * Created by Petr on 4/23/2017.
 */
public interface StatisticsDAO {
    long getEntityRowCount(String entityName);

    List<StatisticsQueryRow> getColumnStatisticsList(String entityName);

    List<ConstraintQueryRow> getConstraintsList();

    List getHistogram(String entityName, String statisticName);

    StatisticHeaderQueryRow getStatsHeader(String entityName, String statisticName);

    Object getMinOfProperty(String entityName, String propertyName);

    Object getMaxOfProperty(String entityName, String propertyName);

    Object getAvgOfProperty(String entityName, String propertyName);
}
