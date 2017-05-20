package cz.zcu.fav.kiv.dobripet.reporting.model.statistics;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Petr on 5/4/2017.
 */
public class DateTimePropertyStatistics extends PropertyStatistics{
    protected Object min;
    protected Object max;

    public DateTimePropertyStatistics(float nullPercentage, long rowsSampled, LocalDateTime updated, List<HistogramRecord> histogram, Object min, Object max) {
        super(nullPercentage, rowsSampled, updated, histogram);
        this.min = min;
        this.max = max;
    }

    public Object getMin() {
        return min;
    }

    public void setMin(Object min) {
        this.min = min;
    }

    public Object getMax() {
        return max;
    }

    public void setMax(Object max) {
        this.max = max;
    }
}
