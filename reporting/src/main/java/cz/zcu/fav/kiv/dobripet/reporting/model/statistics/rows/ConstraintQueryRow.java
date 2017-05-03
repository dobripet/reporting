package cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows;

import javax.persistence.Entity;

/**
 * Created by Petr on 4/28/2017.
 */
public class ConstraintQueryRow {
    private String tableName;
    private String columnName;
    private String constraintDefinition;

    public ConstraintQueryRow(String tableName, String columnName, String constraintDefinition) {
        this.tableName = tableName;
        this.columnName = columnName;
        this.constraintDefinition = constraintDefinition;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getConstraintDefinition() {
        return constraintDefinition;
    }

    public void setConstraintDefinition(String constraintDefinition) {
        this.constraintDefinition = constraintDefinition;
    }
}
