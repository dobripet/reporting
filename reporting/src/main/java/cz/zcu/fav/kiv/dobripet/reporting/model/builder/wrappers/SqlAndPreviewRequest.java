package cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.Column;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.JoinParameters;

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
