package cz.zcu.fav.kiv.dobripet.reporting.service;

import cz.zcu.fav.kiv.dobripet.reporting.dao.StatisticsDAO;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto.*;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.ConstraintQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.HistogramQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticHeaderQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticsQueryRow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service operates with statistics part of application
 * Contains statistics and info initialization, calculation and retrieval
 *
 * Created by Petr on 4/21/2017.
 */
@Service("statisticsService")
@Transactional(value = "dciTransactionManager")
public class StatisticsServiceImpl implements StatisticsService {

    Logger log = LoggerFactory.getLogger(StatisticsService.class);

    private StatisticsDAO statisticsDAO;

    private Config config;

    @Autowired
    public void setStatisticsDAO(StatisticsDAO statisticsDAO) {
        this.statisticsDAO = statisticsDAO;
    }

    @Autowired
    public void setConfig(Config config) {
        this.config = config;
    }

    /**
     * Loads statistics names from database for given configuration
     */
    @Override
    public void init() {
        log.info("Statistics initialization starting");
        //statistic initialization
        for (Entity entity : config.getEntities().values()) {
            //statistics columns
            List<StatisticsQueryRow> list = statisticsDAO.getColumnStatisticsList(entity.getName());
            if (list != null) {
                for (StatisticsQueryRow row : list) {
                    Property property = entity.getProperties().get(row.getColumnName());
                    if (property != null) {
                        property.setStatisticName(row.getStatisticName());
                    }
                }
            }
        }
        //column constraints
        List<ConstraintQueryRow> list = statisticsDAO.getConstraintsList();
        if (list != null) {
            for (ConstraintQueryRow row : list) {
                if (row.getConstraintDefinition() == null){
                    log.warn("invalid constraint in " + row.getTableName() + " " + row.getColumnName());
                    continue;
                }
                Map<String, Set<String>> parsed = parseExpression(row.getConstraintDefinition());
                for (String column : parsed.keySet()) {
                    Entity entity = config.getEntities().get(row.getTableName());
                    if (entity == null) {
                        //entity not found
                        continue;
                    }
                    Property property = entity.getProperties().get(row.getColumnName());
                    if (property == null) {
                        //property not found
                        continue;
                    }
                    property.setEnumConstraints(new HashSet<>(parsed.get(column)));
                }
            }
        }
        log.info("Statistics initialization finished");
    }

    /**
     * Calculates approximated entity row count
     *
     * @param entityName
     * @return dto with count
     */
    @Override
    public RowCount getEntityRowCount(String entityName) {
        return new RowCount(statisticsDAO.getEntityRowCount(entityName));
    }

    /**
     * Calculates and creates new statistic and info object for given entity and property.
     *
     * @param entityName
     * @param propertyName
     * @return dto, depends on property data type
     */
    @Override
    public PropertyStatistics getStatistics(String entityName, String propertyName) {
        Entity entity = config.getEntities().get(entityName);
        if (entity == null) {
            //entity not found
            log.debug("entity is null for entityName" + entityName);
            return null;
        }
        Property property = entity.getProperties().get(propertyName);
        if (property == null) {
            //property not found
            log.warn("property is null for entity " + entity.getName() + " and propertyName" + propertyName);
            return null;
        }
        String statisticsName = property.getStatisticName();
        if (statisticsName == null) {
            //statistics not found
            log.info("statisticName is null for property " + property.getName());
            return null;
        }
        List<HistogramQueryRow> rows = statisticsDAO.getHistogram(entityName, statisticsName);
        StatisticHeaderQueryRow header = statisticsDAO.getStatsHeader(entityName, statisticsName);
        Float nullPercentage = null;
        float trueCount = 0;
        float falseCount = 0;
        List<HistogramRecord> histogram = new ArrayList<>();
        //workaround to get instant from statistic datetime, DBMS returns dates in this format 'Dec 13 2015  8:20PM'
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d yyyy h:mma");
        Timestamp updated = null;
        if (header.getUpdated() != null) {
            LocalDateTime updatedLDT = LocalDateTime.parse(header.getUpdated().replace("  ", " "), formatter);
            updated = Timestamp.valueOf(updatedLDT);
        }
        System.out.println(updated);
        if (rows != null && rows.size() > 0) {
            //process histogram
            float nullCount = 0;
            for (HistogramQueryRow row : rows) {
                String key;
                //count null rows
                if (row.getRangeHiKey() == null || row.getRangeHiKey().equalsIgnoreCase("null")) {
                    nullCount += row.getEqRows();
                    log.debug("number of null rows" + row.getEqRows());
                    key = "NULL";
                    //StatisticHeaderQueryRow header = statisticsDAO.getStatsHeader(entityName, statisticsName);
                } else {
                    key = row.getRangeHiKey();
                }
                //count true and false rows
                if (row.getRangeHiKey() != null) {
                    if (row.getRangeHiKey().equals("1")) {
                        trueCount = row.getEqRows();
                    }
                    if (row.getRangeHiKey().equals("0")) {
                        falseCount = row.getEqRows();
                    }
                }
                //histogram record value is counted as rangeRows + eqRows
                histogram.add(new HistogramRecord(key, row.getEqRows() + row.getRangeRows()));
            }
            //percentage of null records
            if (header.getRows() != null) {
                nullPercentage = 100 * nullCount / header.getRows();
            }

        }
        log.debug("ROWS SAMPLED " + header.getRowsSampled() + " ROWS " + header.getRows());
        //resolve binaries  or strings
        if (property.getDataType().equals("binary") || property.getDataType().equals("string")) {
            //histogram only for constrained properties or less then 20 values
            if ((property.getEnumConstraints() == null || property.getEnumConstraints().size() == 0) && histogram.size() > 20) {
                log.debug("null histogram for 20+ records");
                histogram = null;
            }
            return new PropertyStatistics(nullPercentage, header.getRowsSampled(), updated, histogram);
        }
        //resolve booleans
        if (property.getDataType().equals("bool")) {
            //count percentages
            float truePercentage = 0;
            float falsePercentage = 0;
            if (trueCount != 0 || falseCount != 0) {
                truePercentage = 100 * trueCount / (trueCount + falseCount);
                falsePercentage = 100 * falseCount / (trueCount + falseCount);
            }
            return new BoolPropertyStatistic(nullPercentage, header.getRowsSampled(), updated, histogram, truePercentage, falsePercentage);
        }
        //resolve dates
        Object min = statisticsDAO.getMinOfProperty(entityName, propertyName);
        Object max = statisticsDAO.getMaxOfProperty(entityName, propertyName);
        if (property.getDataType().equals("datetime")) {
            return new DateTimePropertyStatistics(nullPercentage, header.getRowsSampled(), updated, histogram, min, max);
        }
        //resolve numbers
        Object avg = statisticsDAO.getAvgOfProperty(entityName, propertyName);
        if (property.getDataType().equals("number")) {
            return new NumberPropertyStatistics(nullPercentage, header.getRowsSampled(), updated, histogram, min, max, avg);
        }
        return null;
    }


    private Map<String, Set<String>> parseExpression(String expression) {
        if (expression == null) {
            log.error("null expr");
        }
        String noParenthesis = expression.replaceAll("\\(|\\)", " ");
        String[] tokens = noParenthesis.split("\\s+or\\s+|\\s+OR\\s+|\\s+oR\\s+|\\s+Or\\s+");
        Map<String, Set<String>> result = new HashMap<>();
        for (String token : tokens) {
            String[] halves = token.split("\\s*=\\s*");
            //no equals
            if (halves.length < 2) {
                halves = token.split("\\s+is\\s+|\\s+IS\\s+|\\s+iS\\s+|\\s+Is\\s+");
            }
            String name = halves[0].replaceAll("\\[|\\]", "").trim();
            result.computeIfAbsent(name, k -> new HashSet<>());
            result.get(name).add(halves[1].trim());
        }
        return result;
    }
}
