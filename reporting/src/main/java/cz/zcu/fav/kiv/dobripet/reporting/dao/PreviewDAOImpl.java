package cz.zcu.fav.kiv.dobripet.reporting.dao;

import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DAO that handles previews from dci database
 *
 * Created by Petr on 6/8/2017.
 */
@Repository
public class PreviewDAOImpl implements PreviewDAO {
    Logger log = LoggerFactory.getLogger(PreviewDAOImpl.class);

    private SessionFactory sessionFactory;

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Get preview data from given query
     * @param query valid SQL query
     * @return top 25 results
     */
    @Override
    public List getPreviewForStringQuery(String query) {
        log.debug("Query: " + query);
        return sessionFactory.getCurrentSession().createNativeQuery(query).setMaxResults(25).getResultList();
    }
}
