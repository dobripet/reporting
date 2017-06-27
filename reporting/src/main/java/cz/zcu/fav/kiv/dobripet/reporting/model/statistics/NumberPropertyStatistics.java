package cz.zcu.fav.kiv.dobripet.reporting.model.statistics;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Petr on 4/26/2017.
 */
public class NumberPropertyStatistics extends DateTimePropertyStatistics {

    private Object avg;

    public NumberPropertyStatistics(Float nullPercentage, Long rowsSampled, Timestamp updated, List<HistogramRecord> histogram, Object min, Object max, Object avg) {
        super(nullPercentage, rowsSampled, updated, histogram, min, max);
        this.avg = avg;
    }

    public Object getAvg() {
        return avg;
    }

    public void setAvg(Object avg) {
        this.avg = avg;
    }
}
