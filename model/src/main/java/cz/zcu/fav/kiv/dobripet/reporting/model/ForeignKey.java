package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.List;

/**
 * Created by Petr on 4/2/2017.
 */
public class ForeignKey {
    private List<String> localColumnName;
    private List<String> foreignColumnNames;

    public List<String> getLocalColumnName() {
        return localColumnName;
    }

    public void setLocalColumnName(List<String> localColumnName) {
        this.localColumnName = localColumnName;
    }

    public List<String> getForeignColumnNames() {
        return foreignColumnNames;
    }

    public void setForeignColumnNames(List<String> foreignColumnNames) {
        this.foreignColumnNames = foreignColumnNames;
    }
}
