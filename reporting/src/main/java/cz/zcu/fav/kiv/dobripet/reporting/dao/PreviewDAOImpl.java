package cz.zcu.fav.kiv.dobripet.reporting.dao;

import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Petr on 6/8/2017.
 */

@Repository
public class PreviewDAOImpl  implements PreviewDAO {
    Logger log = LoggerFactory.getLogger(PreviewDAOImpl.class);

    private SessionFactory sessionFactory;

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public List getPreviewForStringQuery(String query) {/*
        StringBuilder limited = new StringBuilder(query);
        int select = limited.indexOf("SELECT ");
        if(select > -1){
            limited.insert(select+7, "TOP 25 ");
        }
        System.out.println("test limited " + limited.toString());*/
        return sessionFactory.getCurrentSession().createNativeQuery(query).setMaxResults(25).getResultList();
    }
}
