package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows;

import java.sql.Timestamp;

/**
 * Created by Petr on 4/30/2017.
 */
public class StatisticHeaderQueryRow {
    private String name;
    private String updated;
    private Long rows;
    private Long rowsSampled;
    private Integer steps;
    private Float density;
    private Float averageKeyLength;
    private String stringIndex;
    private String filterExpression;
    private Long unfilteredRows;

    public StatisticHeaderQueryRow(String name, String updated, Long rows, Long rowsSampled, Integer steps, Float density, Float averageKeyLength, String stringIndex, String filterExpression, Long unfilteredRows) {
        this.name = name;
        this.updated = updated;
        this.rows = rows;
        this.rowsSampled = rowsSampled;
        this.steps = steps;
        this.density = density;
        this.averageKeyLength = averageKeyLength;
        this.stringIndex = stringIndex;
        this.filterExpression = filterExpression;
        this.unfilteredRows = unfilteredRows;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public Long getRows() {
        return rows;
    }

    public void setRows(Long rows) {
        this.rows = rows;
    }

    public Long getRowsSampled() {
        return rowsSampled;
    }

    public void setRowsSampled(Long rowsSampled) {
        this.rowsSampled = rowsSampled;
    }

    public Integer getSteps() {
        return steps;
    }

    public void setSteps(Integer steps) {
        this.steps = steps;
    }

    public Float getDensity() {
        return density;
    }

    public void setDensity(Float density) {
        this.density = density;
    }

    public Float getAverageKeyLength() {
        return averageKeyLength;
    }

    public void setAverageKeyLength(Float averageKeyLength) {
        this.averageKeyLength = averageKeyLength;
    }

    public String getStringIndex() {
        return stringIndex;
    }

    public void setStringIndex(String stringIndex) {
        this.stringIndex = stringIndex;
    }

    public String getFilterExpression() {
        return filterExpression;
    }

    public void setFilterExpression(String filterExpression) {
        this.filterExpression = filterExpression;
    }

    public Long getUnfilteredRows() {
        return unfilteredRows;
    }

    public void setUnfilteredRows(Long unfilteredRows) {
        this.unfilteredRows = unfilteredRows;
    }
}
