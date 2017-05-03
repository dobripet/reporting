package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows;

import java.sql.Timestamp;

/**
 * Created by Petr on 4/30/2017.
 */
public class StatisticHeaderQueryRow {
    private String name;
    private String updated;
    private long rows;
    private long rowsSampled;
    private int steps;
    private float density;
    private float averageKeyLength;
    private String stringIndex;
    private String filterExpression;
    private long unfilteredRows;

    public StatisticHeaderQueryRow(String name, String updated, long rows, long rowsSampled, int steps,
        float density, float averageKeyLength, String stringIndex, String filterExpression, long unfilteredRows) {
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

    public long getRows() {
        return rows;
    }

    public void setRows(long rows) {
        this.rows = rows;
    }

    public long getRowsSampled() {
        return rowsSampled;
    }

    public void setRowsSampled(long rowsSampled) {
        this.rowsSampled = rowsSampled;
    }

    public int getSteps() {
        return steps;
    }

    public void setSteps(int steps) {
        this.steps = steps;
    }

    public float getDensity() {
        return density;
    }

    public void setDensity(float density) {
        this.density = density;
    }

    public float getAverageKeyLength() {
        return averageKeyLength;
    }

    public void setAverageKeyLength(float averageKeyLength) {
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

    public long getUnfilteredRows() {
        return unfilteredRows;
    }

    public void setUnfilteredRows(long unfilteredRows) {
        this.unfilteredRows = unfilteredRows;
    }
}
