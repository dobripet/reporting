package cz.zcu.fav.kiv.dobripet.reporting.model.statistics;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Petr on 5/4/2017.
 */
public class BoolPropertyStatistic extends PropertyStatistics {
    private float truePercentage;
    private float falsePercentage;

    public BoolPropertyStatistic(float nullPercentage, long rowsSampled, LocalDateTime updated, List<HistogramRecord> histogram, float truePercentage, float falsePercentage) {
        super(nullPercentage, rowsSampled, updated, histogram);
        this.truePercentage = truePercentage;
        this.falsePercentage = falsePercentage;
    }

    public float getTruePercentage() {
        return truePercentage;
    }

    public void setTruePercentage(float truePercentage) {
        this.truePercentage = truePercentage;
    }

    public float getFalsePercentage() {
        return falsePercentage;
    }

    public void setFalsePercentage(float falsePercentage) {
        this.falsePercentage = falsePercentage;
    }
}
