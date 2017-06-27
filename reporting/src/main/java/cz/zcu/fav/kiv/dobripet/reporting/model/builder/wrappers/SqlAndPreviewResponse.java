package cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers;

import java.util.List;

public class SqlAndPreviewResponse {
    private String sqlQuery;
    private List previewData;

    public String getSqlQuery() {
        return sqlQuery;
    }

    public void setSqlQuery(String sqlQuery) {
        this.sqlQuery = sqlQuery;
    }

    public List getPreviewData() {
        return previewData;
    }

    public void setPreviewData(List previewData) {
        this.previewData = previewData;
    }
}
