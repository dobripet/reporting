package cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * Created by Petr on 6/10/2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class QueryParameters {
    private List<Column> columns;
    private List<JoinParameters> parameters;

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
