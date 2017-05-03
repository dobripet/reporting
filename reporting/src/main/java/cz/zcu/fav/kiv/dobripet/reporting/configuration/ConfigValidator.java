package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.NoResultException;
import java.util.*;

/**
 * Created by Petr on 4/27/2017.
 */
@Repository
public class ConfigValidator {
    Logger log = LoggerFactory.getLogger(ConfigValidator.class);

    @Autowired
    private Config config;

    @Autowired
    private SessionFactory sessionFactory;

    protected Session getSession() {
        return this.sessionFactory.getCurrentSession();
    }

    @Value("${dci.database.databaseName}")
    private String databaseName;

    public void validate(){
        System.out.println("Validator proc " +config);
        String queryTables = "SELECT TABLE_NAME " +
                "FROM INFORMATION_SCHEMA.TABLES " +
                "WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = :databaseName";
        String queryColumns = "SELECT COLUMN_NAME " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = :tableName";
        try{
            //getting all tables in database
            List<String> resultTables = getSession().createNativeQuery(queryTables).setParameter("databaseName", databaseName).getResultList();
            Set<String> tables = new HashSet<>(config.getEntities().keySet());
            for(String tableName : tables) {
                if(resultTables.contains(tableName)){
                    //check columns
                    List<String> resultColumns = getSession().createNativeQuery(queryColumns).setParameter("tableName", tableName).getResultList();
                    Iterator<Map.Entry<String, Property>> iterator = config.getEntities().get(tableName).getProperties().entrySet().iterator();
                    while(iterator.hasNext()) {
                        String columnName = iterator.next().getKey();
                        if (!resultColumns.contains(columnName)) {
                            log.warn("Column " + columnName + " of table " + tableName + " is not present in the database. Ignoring that column.");
                            iterator.remove();
                        }
                    }
                } else{
                    log.warn("Table "+tableName + " is not present in the database. Ignoring that table.");
                    //remove from config
                    config.getEntities().remove(tableName);
                }
            }
        }catch(NoResultException e){
            log.error("validate failed due NoResultException", e);
        }
    }
}
