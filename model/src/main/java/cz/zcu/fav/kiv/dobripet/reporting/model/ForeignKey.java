package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.List;

/**
 * Created by Petr on 4/2/2017.
 */
public class ForeignKey {
    private List<String> localColumnNames;
    private List<String> foreignColumnNames;

    public List<String> getLocalColumnNames() {
        return localColumnNames;
    }

    public void setLocalColumnNames(List<String> localColumnNames) {
        this.localColumnNames = localColumnNames;
    }

    public List<String> getForeignColumnNames() {
        return foreignColumnNames;
    }

    public void setForeignColumnNames(List<String> foreignColumnNames) {
        this.foreignColumnNames = foreignColumnNames;
    }
}
