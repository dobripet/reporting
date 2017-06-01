package cz.zcu.fav.kiv.dobripet.reporting.model.builder;

import java.util.List;

/**
 * Created by Petr on 6/2/2017.
 */
public class ColumnRequest {
    private List<Column> allColumns;
    private List<Column> columns;
    private List<JoinParameters> allJoinParameters;
    // 0 for add, 1 for delete
    private int action;

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }


    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }

    public List<Column> getAllColumns() {
        return allColumns;
    }

    public void setAllColumns(List<Column> allColumns) {
        this.allColumns = allColumns;
    }

    public List<JoinParameters> getAllJoinParameters() {
        return allJoinParameters;
    }

    public void setAllJoinParameters(List<JoinParameters> allJoinParameters) {
        this.allJoinParameters = allJoinParameters;
    }
}
