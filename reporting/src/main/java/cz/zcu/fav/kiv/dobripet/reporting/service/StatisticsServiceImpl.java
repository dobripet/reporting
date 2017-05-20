package cz.zcu.fav.kiv.dobripet.reporting.service;

import cz.zcu.fav.kiv.dobripet.reporting.configuration.ConfigValidator;
import cz.zcu.fav.kiv.dobripet.reporting.dao.StatisticsDAO;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.*;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.ConstraintQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.HistogramQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticHeaderQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticsQueryRow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Created by Petr on 4/23/2017.
 */

@Service("statisticsService")
@Transactional
public class StatisticsServiceImpl implements StatisticsService {

    Logger log = LoggerFactory.getLogger(StatisticsService.class);

    @Autowired
    private StatisticsDAO statisticsDAO;
    @Autowired
    private Config config;

   /* @PostConstruct
    private void init(){
        System.out.println("ajaja " +config + statisticsDAO);
        this.initializeStatistics(config);
    }*/

    @Override
    public void init() {
        // do startup code ..

        System.out.println("ajaja " +config + statisticsDAO);
        //statistic initialization
        //int nullable = 0;
        //int rest = 0;
        for (Entity entity : config.getEntities().values()) {
            //statistics columns
            List<StatisticsQueryRow> list = statisticsDAO.getColumnStatisticsList(entity.getName());
            if(list!= null){
                for(StatisticsQueryRow row : list){
                    //System.out.println( entity.getName() + " " +row.getColumnName() + " " + row.getStatisticName());
                    Property property = entity.getProperties().get(row.getColumnName());
                    if(property != null) {
                        property.setStatisticName(row.getStatisticName());
                        System.out.printf("co se deje");
                        /*if(property.getDataType().equals("datetime")){
                            System.out.println("MINIMUM "+statisticsDAO.getMinDateTime(entity.getName(), property.getName()));

                        }
                        if(property.getDataType().equals("number")){
                            System.out.println("MINIMUM NUMBER "+statisticsDAO.getMinNumber(entity.getName(), property.getName()));

                        }*/
                        //getStatistics(entity.getName(), row.getColumnName());
                    }
                    //System.out.println(mapping.get(property.getName()));
                    /*if(mapping.get(property.getName()) == null){
                        nullable++;
                    }else{
                        rest++;
                    }*/
                }
            }
            //System.out.println(entity.getName() +" null " + nullable + " notnull " +rest);
            //nullable = 0;
           // rest = 0;

        }
        //column constraints
        List<ConstraintQueryRow> list = statisticsDAO.getConstraintsList();
        if(list!= null){
            for(ConstraintQueryRow row : list){
                Map<String, Set<String>> parsed = parseExpression(row.getConstraintDefinition());
                for(String column : parsed.keySet()){
                    Entity entity = config.getEntities().get(row.getTableName());
                    if(entity == null){
                        //entity not found
                        continue;
                    }
                    Property property = entity.getProperties().get(row.getColumnName());
                    if(property == null){
                        //property not found
                        continue;
                    }
                    property.setEnumConstraints(new HashSet<>(parsed.get(column)));
                    /*for(String value : parsed.get(column)){
                        System.out.println("table " + row.getTableName()+ " column: " +column + " value: " +value);
                    }*/
                }
                //
                //System.out.println(row.getConstraintDefinition());

                //config.getEntities().get(row[0]).getProperties().get(row[1]).setStatisticName(row[2]);
                //System.out.println(mapping.get(property.getName()));
                    /*if(mapping.get(property.getName()) == null){
                        nullable++;
                    }else{
                        rest++;
                    }*/
            }
        }

    }

    @Override
    public long getEntityRowCount(String entityName) {
        return statisticsDAO.getEntityRowCount(entityName);
    }


    @Override
    public PropertyStatistics getStatistics(String entityName, String propertyName) {
        Entity entity = config.getEntities().get(entityName);
        if(entity == null){
            //entity not found
            log.debug("entity is null");
            return null;
        }
        Property property = entity.getProperties().get(propertyName);
        if(property == null){
            //property not found
            log.debug("property is null");
            return null;
        }
        String statisticsName = property.getStatisticName();
        if(statisticsName == null){
            //statistics not found
            log.debug("statisticName is null");
            return null;
        }
        float totalNull = 0;
        System.out.println("wtf");
        List<HistogramQueryRow> rows = statisticsDAO.getHistogram(entityName,statisticsName);
        StatisticHeaderQueryRow header = statisticsDAO.getStatsHeader(entityName, statisticsName);
        float nullPercentage = 0;
        float trues = 0;
        float falses = 0;
        List<HistogramRecord> histogram = new ArrayList<>();
        //workaround to get instant from statistic datetime, DBMS returns dates in this format 'Dec 13 2015  8:20PM'
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d yyyy h:mma");
        LocalDateTime updated = LocalDateTime.parse(header.getUpdated().replace("  ", " "), formatter);
        System.out.println(updated);
        if(rows != null && rows.size() > 0) {
            //process histogram
            float nullCount = 0;
            for (HistogramQueryRow row : rows) {
                //count null rows
                if (row.getRangeHiKey() == null || row.getRangeHiKey().equalsIgnoreCase("null")) {
                    nullCount+=row.getEqRows();
                    System.out.println("je NULL " + row.getEqRows());
                    //StatisticHeaderQueryRow header = statisticsDAO.getStatsHeader(entityName, statisticsName);
                }
                //count true and false rows
                if( row.getRangeHiKey()!= null) {
                    if (row.getRangeHiKey().equals("1")) {
                        trues = row.getEqRows();
                    }
                    if (row.getRangeHiKey().equals("0")) {
                        falses = row.getEqRows();
                    }
                }
                //histogram record value is counted as rangeRows + eqRows
                histogram.add(new HistogramRecord(row.getRangeHiKey(),row.getEqRows()+row.getRangeRows()));
            }
            //percentage of null records
            nullPercentage = 100*nullCount/header.getRows();

        }
        //usable size of histogram
        /*if(histogram.size() > 20){
            histogram = null;
        }*/
        log.warn("ROWS SAMPLED "+header.getRowsSampled() + " ROWS " +header.getRows());
        //resolve binaries  or strings
        if(property.getDataType().equals("binary") || property.getDataType().equals("string")){
            //histogram only for constrained properties
            if(property.getEnumConstraints() == null || property.getEnumConstraints().size() == 0){
                histogram = null;
            }
            return new PropertyStatistics(nullPercentage, header.getRowsSampled(), updated, histogram);
        }
        //resolve booleans
        if(property.getDataType().equals("bool")){
            //count percentages
            float truePercentage = 0;
            float falsePercentage = 0;
            if(trues != 0 || falses != 0){
                truePercentage = 100 * trues / (trues + falses);
                falsePercentage = 100 * falses / (trues + falses);
            }
            return new BoolPropertyStatistic(nullPercentage, header.getRowsSampled(), updated, histogram, truePercentage, falsePercentage);
        }
        //resolve dates
        Object min = statisticsDAO.getMinOfProperty(entityName, propertyName);
        Object max = statisticsDAO.getMaxOfProperty(entityName, propertyName);
        if(property.getDataType().equals("datetime")){
            return new DateTimePropertyStatistics(nullPercentage, header.getRowsSampled(), updated, histogram, min, max);
        }
        //resolve numbers
        Object avg = statisticsDAO.getAvgOfProperty(entityName,propertyName);
        if(property.getDataType().equals("number")){
            return new NumberPropertyStatistics(nullPercentage,header.getRowsSampled(), updated, histogram, min, max, avg);
        }
        return null;
    }


    private Map<String, Set<String>> parseExpression(String expression){
        String noParenthesis = expression.replaceAll("\\(|\\)"," ");
        String[] tokens = noParenthesis.split("\\s+or\\s+|\\s+OR\\s+|\\s+oR\\s+|\\s+Or\\s+");
        Map<String, Set<String>> result = new HashMap<>();
        for (String token: tokens){
            String[] halves = token.split("\\s*=\\s*");
            //no equals
            if(halves.length < 2){
                halves = token.split("\\s+is\\s+|\\s+IS\\s+|\\s+iS\\s+|\\s+Is\\s+");
            }
            String name = halves[0].replaceAll("\\[|\\]", "").trim();
            result.computeIfAbsent(name, k -> new HashSet<>());
            result.get(name).add(halves[1].trim());
        }
        return result;
    }
}
