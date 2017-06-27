package cz.zcu.fav.kiv.dobripet.reporting.dao;

import cz.zcu.fav.kiv.dobripet.reporting.model.builder.CustomQuery;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
//@Qualifier("entityManagerFactory")
//@Transactional(value = "reportingTransactionManager")
public interface CustomQueryDAO extends CrudRepository<CustomQuery, Integer>{
    List<CustomQuery> findAllByCreatedById(int createdById);
}