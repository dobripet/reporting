package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows;

/**
 * Created by Petr on 4/29/2017.
 */

import javax.persistence.Entity;

/**
 * https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-show-statistics-transact-sql
 */
public class HistogramQueryRow {

    private String rangeHiKey;
    private float rangeRows;
    private float eqRows;
    private float distinctRangeRows;
    private float avgRangeRows;

    public HistogramQueryRow(String rangeHiKey, float rangeRows, float eqRows, float distinctRangeRows, float avgRangeRows) {
        this.rangeHiKey = rangeHiKey;
        this.rangeRows = rangeRows;
        this.eqRows = eqRows;
        this.distinctRangeRows = distinctRangeRows;
        this.avgRangeRows = avgRangeRows;
    }

    public String getRangeHiKey() {
        return rangeHiKey;
    }

    public void setRangeHiKey(String rangeHiKey) {
        this.rangeHiKey = rangeHiKey;
    }

    public float getRangeRows() {
        return rangeRows;
    }

    public void setRangeRows(float rangeRows) {
        this.rangeRows = rangeRows;
    }

    public float getEqRows() {
        return eqRows;
    }

    public void setEqRows(float eqRows) {
        this.eqRows = eqRows;
    }

    public float getDistinctRangeRows() {
        return distinctRangeRows;
    }

    public void setDistinctRangeRows(float distinctRangeRows) {
        this.distinctRangeRows = distinctRangeRows;
    }

    public float getAvgRangeRows() {
        return avgRangeRows;
    }

    public void setAvgRangeRows(float avgRangeRows) {
        this.avgRangeRows = avgRangeRows;
    }
}
