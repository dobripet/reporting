package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.dto;

/**
 * Created by Petr on 7/19/2017.
 */
public class RowCount {
    private long rowCount;

    public RowCount(long rowCount) {
        this.rowCount = rowCount;
    }

    public long getRowCount() {
        return rowCount;
    }

    public void setRowCount(long rowCount) {
        this.rowCount = rowCount;
    }
}
