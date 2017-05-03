package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows;

/**
 * Created by Petr on 4/28/2017.
 */
public class StatisticsQueryRow {
    private String columnName;
    private String statisticName;

    public StatisticsQueryRow(String columnName, String statisticName) {
        this.columnName = columnName;
        this.statisticName = statisticName;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getStatisticName() {
        return statisticName;
    }

    public void setStatisticName(String statisticName) {
        this.statisticName = statisticName;
    }
}
