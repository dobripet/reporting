package cz.zcu.fav.kiv.dobripet.reporting.model.statistics;

//import java.time.LocalDateTime;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Petr on 4/23/2017.
 */
public class PropertyStatistics {
    protected float nullPercentage;
    protected long rowsSampled;
    protected Timestamp updated;
    protected List<HistogramRecord> histogram;

    public PropertyStatistics(float nullPercentage, long rowsSampled, Timestamp updated, List<HistogramRecord> histogram) {
        this.nullPercentage = nullPercentage;
        this.rowsSampled = rowsSampled;
        this.updated = updated;
        this.histogram = histogram;
    }

    public float getNullPercentage() {
        return nullPercentage;
    }

    public void setNullPercentage(float nullPercentage) {
        this.nullPercentage = nullPercentage;
    }

    public long getRowsSampled() {
        return rowsSampled;
    }

    public void setRowsSampled(long rowsSampled) {
        this.rowsSampled = rowsSampled;
    }

    public Timestamp getUpdated() {
        return updated;
    }

    public void setUpdated(Timestamp updated) {
        this.updated = updated;
    }

    public List<HistogramRecord> getHistogram() {
        return histogram;
    }

    public void setHistogram(List<HistogramRecord> histogram) {
        this.histogram = histogram;
    }
}
