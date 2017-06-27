package cz.zcu.fav.kiv.dobripet.reporting.model.builder;

import javax.persistence.Column;
import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Created by Petr on 6/10/2017.
 */
@Entity()
@Table(name = "Custom_Query")
public class CustomQuery {
    private int id;
    private String queryName;
    private int createdById;
    private LocalDateTime createdDate;
    private int updatedById;
    private LocalDateTime updatedDate;
    private String queryParameters;
    private boolean valid;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Custom_Query_ID", unique = true, nullable = false)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "Query_Name", nullable = false, length = 100)
    public String getQueryName() {
        return queryName;
    }

    public void setQueryName(String queryName) {
        this.queryName = queryName;
    }

    @Column(name = "Created_By_ID", nullable = false)
    public int getCreatedById() {
        return createdById;
    }

    public void setCreatedById(int createdById) {
        this.createdById = createdById;
    }

    @Column(name = "Create_Date", nullable = false)
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "Updated_By_ID", nullable = false)
    public int getUpdatedById() {
        return updatedById;
    }

    public void setUpdatedById(int updatedById) {
        this.updatedById = updatedById;
    }

    @Column(name = "Update_Date", nullable = false)
    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Column(name = "Query_Parameters", nullable = false)
    public String getQueryParameters() {
        return queryParameters;
    }

    public void setQueryParameters(String queryParameters) {
        this.queryParameters = queryParameters;
    }

    @Column(name = "Valid", nullable = false)
    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
