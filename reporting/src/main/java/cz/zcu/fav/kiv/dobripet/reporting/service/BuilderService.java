package cz.zcu.fav.kiv.dobripet.reporting.service;

import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.Column;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.ColumnRequest;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.ColumnResponse;

import java.util.List;

/**
 * Created by Petr on 5/24/2017.
 */
public interface BuilderService {
    //String getJoinFromColumns(List<Column> columns);
    ColumnResponse getJoinFromColumns(ColumnRequest columnRequest);
    List<String> getPriorityPath(Entity start, Entity end);
    List<List<String>> getAllPaths(Entity start, Entity end);
}
