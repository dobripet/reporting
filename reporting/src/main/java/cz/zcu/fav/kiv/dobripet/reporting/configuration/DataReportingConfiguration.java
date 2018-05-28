package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;
import org.hibernate.cfg.AvailableSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;


/**
 * Configuration of reporting database data source
 *
 * Created by Petr on 4/5/2017.
 */
@Configuration
@PropertySource(value = {"classpath:application.properties"})
@EnableJpaRepositories(
        transactionManagerRef = "reportingTransactionManager",
        basePackages = {"cz.zcu.fav.kiv.dobripet.reporting.dao"})
public class DataReportingConfiguration {

    private Environment env;

    @Autowired
    public void setEnv(Environment env) {
        this.env = env;
    }

    @Bean(name = "reportingDataSource")
    public DataSource getDataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName(env.getProperty("reporting.datasource.driverClassName"));
        dataSource.setUrl(env.getProperty("reporting.datasource.url"));
        dataSource.setUsername(env.getProperty("reporting.datasource.username"));
        dataSource.setPassword(env.getProperty("reporting.datasource.password"));
        return dataSource;
    }

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactory.setDataSource(getDataSource());
        entityManagerFactory.setPackagesToScan(new String[]{"cz.zcu.fav.kiv.dobripet.reporting.model.builder"});
        entityManagerFactory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        entityManagerFactory.setJpaProperties(getHibernateProperties());
        return entityManagerFactory;
    }

    private Properties getHibernateProperties() {
        Properties properties = new Properties();
        properties.put(AvailableSettings.DIALECT, env.getRequiredProperty("reporting.hibernate.dialect"));
        properties.put(AvailableSettings.SHOW_SQL, env.getRequiredProperty("hibernate.show_sql"));
        properties.put(AvailableSettings.HBM2DDL_AUTO, env.getRequiredProperty("hibernate.hbm2ddl.auto"));
        properties.put(AvailableSettings.DEFAULT_SCHEMA, env.getRequiredProperty("reporting.database.schemaName"));
        return properties;
    }

    @Bean(name = "reportingTransactionManager")
    public JpaTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);
        return transactionManager;
    }
}
