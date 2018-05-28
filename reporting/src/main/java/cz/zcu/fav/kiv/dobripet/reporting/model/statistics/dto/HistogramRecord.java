package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto;

/**
 * Created by Petr on 5/3/2017.
 */
public class HistogramRecord {
    private String name;
    private float value;

    public HistogramRecord(String name, float value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getValue() {
        return value;
    }

    public void setValue(float value) {
        this.value = value;
    }
}
