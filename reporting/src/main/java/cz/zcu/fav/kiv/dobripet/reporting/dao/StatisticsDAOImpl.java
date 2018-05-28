package cz.zcu.fav.kiv.dobripet.reporting.dao;

import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.ConstraintQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.HistogramQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticHeaderQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticsQueryRow;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.type.LongType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import javax.persistence.NoResultException;
import java.util.List;

/**
 * DAO that handles statistics and info from dci database
 *
 * Created by Petr on 4/23/2017.
 */
@Repository
public class StatisticsDAOImpl implements StatisticsDAO {
    Logger log = LoggerFactory.getLogger(StatisticsDAOImpl.class);

    @Value("${dci.database.schemaName}")
    private String schemaName;

    private SessionFactory sessionFactory;

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    protected Session getSession() {
        return this.sessionFactory.getCurrentSession();
    }

    /**
     * Get approximate value from database
     * @param entityName no schema
     * @return row count of entity
     */
    @Override
    public long getEntityRowCount(String entityName) {
        String query = "SELECT CAST(p.rows AS bigint) AS count " +
                "FROM sys.tables AS tbl " +
                "INNER JOIN sys.indexes AS idx ON idx.object_id = tbl.object_id and idx.index_id < 2 " +
                "INNER JOIN sys.partitions AS p ON p.object_id=CAST(tbl.object_id AS int) AND p.index_id=idx.index_id " +
                "INNER JOIN sys.schemas AS s ON s.schema_id = tbl.schema_id " +
                "WHERE tbl.name=:entityName " +
                "AND s.name='" + schemaName + "'";
        try {
            return (long) getSession().createNativeQuery(query).setParameter("entityName", entityName).addScalar("count", LongType.INSTANCE).getSingleResult();
        } catch (NoResultException e) {
            log.error("getEntityRowCount failed due NoResultException", e);
            return -1;
        }
    }

    /**
     * Get all column names and associated statistics
     * @param entityName no schema
     * @return list of mapped columns
     */
    @Override
    public List<StatisticsQueryRow> getColumnStatisticsList(String entityName) {
        String query = "SELECT c.name AS column_name, s.name AS statistic_name " +
                "FROM sys.stats AS s  " +
                "INNER JOIN sys.stats_columns AS sc   " +
                "ON s.object_id = sc.object_id AND s.stats_id = sc.stats_id  " +
                "INNER JOIN sys.columns AS c   " +
                "ON sc.object_id = c.object_id AND c.column_id = sc.column_id  " +
                "WHERE s.object_id = OBJECT_ID(:entitySchemedName) AND sc.stats_column_id = 1";
        try {
            //creating name with schema
            String entitySchemedName = schemaName + "." + entityName;
            //some manual mapping
            return getSession().createNativeQuery(query).setParameter("entitySchemedName", entitySchemedName).setResultSetMapping("StatisticsQueryRow").getResultList();
        } catch (NoResultException e) {
            log.error("getColumnStatisticsList failed due NoResultException", e);
            return null;
        }
    }

    /**
     * Get all CHECK constraints from given database
     * @return list of mapped constraints
     */
    @Override
    public List<ConstraintQueryRow> getConstraintsList() {
        String query = "SELECT o.name AS table_name, c.name AS column_name, cc.definition AS constraint_definition " +
                "FROM sys.check_constraints cc " +
                "INNER JOIN sys.columns c ON cc.parent_column_id = c.column_id AND cc.parent_object_id = c.object_id " +
                "INNER JOIN sys.objects o ON cc.parent_object_id = o.object_id";
        try {
            //some manual mapping
            return getSession().createNativeQuery(query).setResultSetMapping("ConstraintQueryRow").getResultList();
        } catch (NoResultException e) {
            log.error("getConstraintsMapping failed due NoResultException", e);
            return null;
        }
    }

    /**
     * Get histogram for given entity and statistic
     * @param entityName
     * @param statisticName
     * @return all histogram rows
     */
    @Override
    public List<HistogramQueryRow> getHistogram(String entityName, String statisticName) {
        String query = "DBCC SHOW_STATISTICS (:entitySchemedName, :statisticName ) WITH HISTOGRAM";
        System.out.println(entityName + " " + statisticName);
        try {
            //creating name with schema
            String entitySchemedName = schemaName + "." + entityName;
            //some manual mapping
            return getSession().createNativeQuery(query).
                    setParameter("entitySchemedName", entitySchemedName).
                    setParameter("statisticName", statisticName).
                    setResultSetMapping("HistogramQueryRow").getResultList();
        } catch (NoResultException e) {
            log.error("getConstraintsMapping failed due NoResultException", e);
            return null;
        }
    }

    /**
     * Get statistic header for given entity and statistic
     * @param entityName
     * @param statisticName
     * @return mapped statistic header
     */
    @Override
    public StatisticHeaderQueryRow getStatsHeader(String entityName, String statisticName) {
        String query = "DBCC SHOW_STATISTICS (:entitySchemedName, :statisticName ) WITH STAT_HEADER";
        try {
            //creating name with schema
            String entitySchemedName = schemaName + "." + entityName;
            //some manual mapping
            return (StatisticHeaderQueryRow) getSession().createNativeQuery(query).
                    setParameter("entitySchemedName", entitySchemedName).
                    setParameter("statisticName", statisticName).
                    setResultSetMapping("StatisticHeaderQueryRow").getSingleResult();
        } catch (NoResultException e) {
            log.error("getConstraintsMapping failed due NoResultException", e);
            return null;
        }
    }

    @Override
    public Object getMinOfProperty(String entityName, String propertyName) {
        String entitySchemedName = schemaName + "." + entityName;
        String query = "SELECT MIN(p." + propertyName + ") AS min FROM " + entitySchemedName + " p";
        try {
            return getSession().createNativeQuery(query)
                    .addScalar("min")
                    .getSingleResult();
        } catch (NoResultException e) {
            log.error("getMinOfProperty failed due NoResultException", e);
            return null;
        }
    }

    @Override
    public Object getMaxOfProperty(String entityName, String propertyName) {
        String entitySchemedName = schemaName + "." + entityName;
        String query = "SELECT MAX(p." + propertyName + ") AS max FROM " + entitySchemedName + " p";
        try {
            return getSession().createNativeQuery(query)
                    .addScalar("max")
                    .getSingleResult();
        } catch (NoResultException e) {
            log.error("getMaxOfProperty failed due NoResultException", e);
            return null;
        }
    }

    @Override
    public Object getAvgOfProperty(String entityName, String propertyName) {
        String entitySchemedName = schemaName + "." + entityName;
        String query = "SELECT AVG(p." + propertyName + ") AS avg FROM " + entitySchemedName + " p";
        try {
            return getSession().createNativeQuery(query)
                    .addScalar("avg")
                    .getSingleResult();
        } catch (NoResultException e) {
            log.error("getAvgOfProperty failed due NoResultException", e);
            return null;
        }
    }
}
