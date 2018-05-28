package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.ForeignKey;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import javax.persistence.NoResultException;
import java.util.*;

/**
 * Configuration validator
 *
 * Created by Petr on 4/27/2017.
 */
@Repository
public class ConfigValidator {
    @Value("${dci.database.databaseName}")
    private String databaseName;

    Logger log = LoggerFactory.getLogger(ConfigValidator.class);

    private Config config;

    private SessionFactory sessionFactory;

    @Autowired
    public void setConfig(Config config) {
        this.config = config;
    }

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    protected Session getSession() {
        return this.sessionFactory.getCurrentSession();
    }

    /**
     * Validates JSON configuration to connected database
     */
    public void validate() {
        log.info("Configuration validation start.");

        String queryTables = "SELECT TABLE_NAME " +
                "FROM INFORMATION_SCHEMA.TABLES " +
                "WHERE (TABLE_TYPE = 'BASE TABLE' OR TABLE_TYPE = 'VIEW') AND TABLE_CATALOG = :databaseName";
        String queryColumns = "SELECT COLUMN_NAME " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = :tableName";
        try {
            //getting all tables in database
            List<String> resultTables = getSession().createNativeQuery(queryTables).setParameter("databaseName", databaseName).getResultList();
            Set<String> tables = new HashSet<>(config.getEntities().keySet());
            for (String tableName : tables) {
                if (resultTables.contains(tableName)) {
                    //check columns
                    List<String> resultColumns = getSession().createNativeQuery(queryColumns).setParameter("tableName", tableName).getResultList();
                    Iterator<Map.Entry<String, Property>> iterator = config.getEntities().get(tableName).getProperties().entrySet().iterator();
                    while (iterator.hasNext()) {
                        String columnName = iterator.next().getKey();
                        if (!resultColumns.contains(columnName)) {
                            log.warn("Column " + columnName + " of table " + tableName + " is not present in the database. Ignoring that column.");
                            iterator.remove();
                        }
                    }
                } else {
                    log.warn("Table " + tableName + " is not present in the database. Ignoring that table.");
                    //remove all foreign keys
                    if (config.getEntities().get(tableName).getReferenceMap() != null) {
                        for (String foreignTable : config.getEntities().get(tableName).getReferenceMap().keySet()) {
                            if (config.getEntities().get(foreignTable) != null && config.getEntities().get(foreignTable).getReferredByMap() != null) {
                                config.getEntities().get(foreignTable).getReferredByMap().remove(tableName);
                            }
                        }
                    }
                    if (config.getEntities().get(tableName).getReferenceMap() != null) {
                        for (String foreignTable : config.getEntities().get(tableName).getReferredByMap().keySet()) {
                            if (config.getEntities().get(foreignTable) != null && config.getEntities().get(foreignTable).getReferenceMap() != null) {
                                config.getEntities().get(foreignTable).getReferenceMap().remove(tableName);
                            }
                        }
                    }
                    //remove from config
                    config.getEntities().remove(tableName);
                }
            }


            //foreign keys validation
            for (String tableName : config.getEntities().keySet()) {
                for (String foreignTable : config.getEntities().get(tableName).getReferenceMap().keySet()) {
                    Iterator<ForeignKey> iterator = config.getEntities().get(tableName).getReferenceMap().get(foreignTable).iterator();
                    checkForeignKeys(tableName, foreignTable, iterator);

                }
                for (String foreignTable : config.getEntities().get(tableName).getReferredByMap().keySet()) {
                    Iterator<ForeignKey> iterator = config.getEntities().get(tableName).getReferredByMap().get(foreignTable).iterator();
                    checkForeignKeys(tableName, foreignTable, iterator);
                }
            }

        } catch (NoResultException e) {
            log.error("validate failed due NoResultException", e);
        }
        log.info("Configuration validation end.");
    }

    private void checkForeignKeys(String tableName, String foreignTable, Iterator<ForeignKey> iterator) {
        while (iterator.hasNext()) {
            ForeignKey foreignKey = iterator.next();
            if (config.getEntities().get(foreignTable) != null &&
                    config.getEntities().get(foreignTable).getProperties() != null &&
                    !config.getEntities().get(foreignTable).getProperties().keySet().contains(foreignKey.getForeignColumnName())) {
                iterator.remove();
                log.warn("Foreign key columns " + foreignKey.getLocalColumnName() + " -> " + foreignKey.getForeignColumnName() + " between tables " + tableName + " and " + foreignTable + " are not valid columns. Ignoring that foreign key.");
            }
            if (config.getEntities().get(tableName) != null &&
                    config.getEntities().get(tableName).getProperties() != null &&
                    !config.getEntities().get(tableName).getProperties().keySet().contains(foreignKey.getLocalColumnName())) {
                log.warn("Foreign key columns " + foreignKey.getLocalColumnName() + " -> " + foreignKey.getForeignColumnName() + " between tables " + tableName + " and " + foreignTable + " are not valid columns. Ignoring that foreign key.");
                iterator.remove();
            }
        }
    }
}
