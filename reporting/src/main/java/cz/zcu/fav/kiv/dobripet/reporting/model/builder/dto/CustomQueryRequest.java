package cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto;

import java.util.List;

/**
 * Created by Petr on 6/10/2017.
 */
public class CustomQueryRequest {
    private String queryName;
    private List<Column> columns;
    private List<JoinParameters> parameters;

    public String getQueryName() {
        return queryName;
    }

    public void setQueryName(String queryName) {
        this.queryName = queryName;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public List<JoinParameters> getParameters() {
        return parameters;
    }

    public void setParameters(List<JoinParameters> parameters) {
        this.parameters = parameters;
    }

}
