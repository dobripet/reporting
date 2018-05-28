package cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto;

/**
 * Created by Petr on 9/18/2017.
 */
public class ErrorResponse {
    private String error;

    public ErrorResponse(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
