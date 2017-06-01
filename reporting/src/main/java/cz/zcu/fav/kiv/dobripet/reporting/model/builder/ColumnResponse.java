package cz.zcu.fav.kiv.dobripet.reporting.model.builder;

/**
 * Created by Petr on 5/28/2017.
 */
public class ColumnResponse {
    //status 0 for adding only column to existing join, 1 for defining new join, 10 no path found, -1 invalid data(non existent column or entity in config)
    private int status;
    private JoinParameters joinParameters;
    //private String error;


    public ColumnResponse(int status, JoinParameters joinParameters) {
        this.status = status;
        this.joinParameters = joinParameters;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public JoinParameters getJoinParameters() {
        return joinParameters;
    }

    public void setJoinParameters(JoinParameters joinParameters) {
        this.joinParameters = joinParameters;
    }
}
