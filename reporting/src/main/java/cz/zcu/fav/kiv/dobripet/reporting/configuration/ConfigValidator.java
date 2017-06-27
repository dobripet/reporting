package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import cz.zcu.fav.kiv.dobripet.reporting.service.BuilderService;
import cz.zcu.fav.kiv.dobripet.reporting.utils.GraphPaths;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
    @Value("${dci.database.databaseName}")
    private String databaseName;

    Logger log = LoggerFactory.getLogger(ConfigValidator.class);

    private Config config;

    private SessionFactory sessionFactory;

    //TODO test only
    private BuilderService builderService;

    @Autowired
    public void setConfig(Config config) {
        this.config = config;
    }

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Autowired
    public void setBuilderService(BuilderService builderService) {
        this.builderService = builderService;
    }

    protected Session getSession() {
        return this.sessionFactory.getCurrentSession();
    }

    public void validate(){
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

                //TODO smazat
                if(config.getEntities().get(tableName) == null || config.getEntities().get(tableName).getReferenceMap() == null || config.getEntities().get(tableName).getReferredByMap() == null){
                    continue;
                }
                Set<String> a = config.getEntities().get(tableName).getReferenceMap().keySet();
                Set<String> b = config.getEntities().get(tableName).getReferredByMap().keySet();
                for (String c : a){
                    if(b.contains(c)){
                        System.out.println("REKURZE " + tableName);
                    }
                }

            }

            //test muj temp
            Entity start = config.getEntities().get("Warehouse_Packages");
            Entity end = config.getEntities().get("Positions");
            System.out.println("priority PATH "+ builderService.getPriorityPath(start,end).toString());
            List<List<String>>  paths = builderService.getAllPaths(start, end);
            System.out.println("PATH COUNT " +paths.size());
            for(List<String> path : paths){
                System.out.println(path.toString());
            }
           // List<List<String>>  paths = GraphPaths.findAllPathsBetween(start,end,config);
            //System.out.println("PATH " + GraphPaths.findShortestPath(start, end, config).toString());
           /* for(List<String> path : paths){
                System.out.println(path.toString());
            }
*/
        }catch(NoResultException e){
            log.error("validate failed due NoResultException", e);
        }
    }
}
