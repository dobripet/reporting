package cz.zcu.fav.kiv.dobripet.reporting.model.builder.wrappers;

import cz.zcu.fav.kiv.dobripet.reporting.model.builder.JoinParameters;

import java.util.List;

/**
 * Created by Petr on 5/28/2017.
 */
public class ColumnResponse {
    //status 0 for adding only column to existing join or trivial join, 1 for defining new join, 10 no path found
    private int status;
    private List<JoinParameters> joinParameters;
    //private String error;
    //private JoinParameters newJoinParameters;

    public ColumnResponse(int status, List<JoinParameters> joinParameters) {
        this.status = status;
        this.joinParameters = joinParameters;
        //this.newJoinParameters = null;
    }

    /*
        public ColumnResponse(int status, List<JoinParameters> joinParameters, JoinParameters newJoinParameters) {
            this.status = status;
            this.joinParameters = joinParameters;
            this.newJoinParameters = newJoinParameters;
        }
    */
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public List<JoinParameters> getJoinParameters() {
        return joinParameters;
    }

    public void setJoinParameters(List<JoinParameters> joinParameters) {
        this.joinParameters = joinParameters;
    }
/*
    public JoinParameters getNewJoinParameters() {
        return newJoinParameters;
    }

    public void setNewJoinParameters(JoinParameters newJoinParameters) {
        this.newJoinParameters = newJoinParameters;
    }
    */

}
