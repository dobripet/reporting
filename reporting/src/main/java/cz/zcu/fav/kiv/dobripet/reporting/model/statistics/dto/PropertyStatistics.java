package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto;

//import java.time.LocalDateTime;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by Petr on 4/23/2017.
 */
public class PropertyStatistics {
    protected Float nullPercentage;
    protected Long rowsSampled;
    protected Timestamp updated;
    protected List<HistogramRecord> histogram;

    public PropertyStatistics(Float nullPercentage, Long rowsSampled, Timestamp updated, List<HistogramRecord> histogram) {
        this.nullPercentage = nullPercentage;
        this.rowsSampled = rowsSampled;
        this.updated = updated;
        this.histogram = histogram;
    }

    public Float getNullPercentage() {
        return nullPercentage;
    }

    public void setNullPercentage(Float nullPercentage) {
        this.nullPercentage = nullPercentage;
    }

    public Long getRowsSampled() {
        return rowsSampled;
    }

    public void setRowsSampled(Long rowsSampled) {
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
