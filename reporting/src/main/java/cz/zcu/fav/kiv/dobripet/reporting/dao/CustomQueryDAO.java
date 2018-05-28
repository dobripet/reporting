package cz.zcu.fav.kiv.dobripet.reporting.dao;

import cz.zcu.fav.kiv.dobripet.reporting.model.builder.CustomQuery;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DAO that connects to reporting database and handles Customer Queries
 * Created by Petr on 6/8/2017.
 */
@Repository
public interface CustomQueryDAO extends CrudRepository<CustomQuery, Integer>{
    List<CustomQuery> findAllByCreatedById(int createdById);
}