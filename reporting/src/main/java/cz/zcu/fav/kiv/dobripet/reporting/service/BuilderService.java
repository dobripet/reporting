package cz.zcu.fav.kiv.dobripet.reporting.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.ForeignKey;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.CustomQuery;
import cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto.*;
import cz.zcu.fav.kiv.dobripet.reporting.utils.InvalidDataException;

import java.util.List;

/**
 * Created by Petr on 5/24/2017.
 */
public interface BuilderService {
    /* alternative approach, finding paths on backend
    String getJoinFromColumns(List<Column> columns);
    ColumnResponse getJoinFromColumns(ColumnRequest columnRequest) throws InvalidDataException;
    List<List<ForeignKey>> getJoinKeysFromPath(List<String> path);
    List<String> getPriorityPath(Entity start, Entity end);
    List<List<String>> getAllPaths(Entity start, Entity end);*/
    SqlAndPreviewResponse getSqlAndPreview(SqlAndPreviewRequest sqlAndPreviewRequest) throws InvalidDataException;
    CustomQuery saveCustomQuery(CustomQueryRequest customQueryRequest, Integer id) throws InvalidDataException, JsonProcessingException;
    List<CustomQuery> getAllCustomQueriesForCurrentUser();
}
