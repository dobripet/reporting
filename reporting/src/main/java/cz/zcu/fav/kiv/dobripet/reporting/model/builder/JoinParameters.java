package cz.zcu.fav.kiv.dobripet.reporting.model.builder;

import cz.zcu.fav.kiv.dobripet.reporting.model.ForeignKey;

import java.util.List;

/**
 * Created by Petr on 5/28/2017.
 */
public class JoinParameters {
    private List<String> selectedPath;
    private List<List<String>> paths;
    //columns for currently selected path
    private List<List<ForeignKey>> allJoinColumns;



    public List<String> getSelectedPath() {
        return selectedPath;
    }

    public void setSelectedPath(List<String> selectedPath) {
        this.selectedPath = selectedPath;
    }

    public List<List<String>> getPaths() {
        return paths;
    }

    public void setPaths(List<List<String>> paths) {
        this.paths = paths;
    }

    /*public ForeignKey getSelectedJoinColumn() {
        return selectedJoinColumn;
    }

    public void setSelectedJoinColumn(ForeignKey selectedJoinColumn) {
        this.selectedJoinColumn = selectedJoinColumn;
    }*/

    public List<List<ForeignKey>> getAllJoinColumns() {
        return allJoinColumns;
    }

    public void setAllJoinColumns(List<List<ForeignKey>> allJoinColumns) {
        this.allJoinColumns = allJoinColumns;
    }
}
