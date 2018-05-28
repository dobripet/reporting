package cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SqlAndPreviewRequest {
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
