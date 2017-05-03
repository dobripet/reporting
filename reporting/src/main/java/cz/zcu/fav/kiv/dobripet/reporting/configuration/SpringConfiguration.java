package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.service.StatisticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import java.io.IOException;

/**
 * Created by Petr on 2/26/2017.
 */

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "cz.zcu.fav.kiv.dobripet")
@EnableTransactionManagement
@PropertySource("classpath:application.properties")
public class SpringConfiguration extends WebMvcConfigurerAdapter{

    private Logger log = LoggerFactory.getLogger(SpringConfiguration.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/js/**").addResourceLocations("/resources/js/");
        registry.addResourceHandler("/css/**").addResourceLocations("/resources/css/");
        //just temporary documentation location
        registry.addResourceHandler("/documentation/**").addResourceLocations("/resources/documentation/");
        //Important to setOrder, handles resources before controller
        registry.setOrder(-1);
    }

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setViewClass(JstlView.class);
        viewResolver.setPrefix("/WEB-INF/view/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }

    //enables Value annotation in controller to get application.properties values
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    //Config regarding reporting

    //Reads documentation root URL from application.properties
    /**
     * Reads config from reporting-config.json.
     * Initialize documentation
     * @return configuration for reporting module
     */
    @Bean
    @Scope("singleton")
    public Config getConfig(){
        Config config = null;
        try {
            config = getObjectMapper().readValue((new ClassPathResource("reporting-config.json")).getFile(), Config.class);
            log.info("REPORTING CONFIG LOADED");
        } catch (IOException e) {
            log.error("FAILED TO LOAD REPORTING CONFIG", e);
        }
        return config;
    }

    /**
     * Reporting initialization is done after context is refreshed
     * @return reporting initializer
     */
    @Bean
    @Scope("singleton")
    public ReportingInitializer getReportingInitializer(){
        return new ReportingInitializer();
    }


    /**
     * Bean initialization
     * @return JSON object mapper
     */
    @Bean
    @Scope("singleton")
    public ObjectMapper getObjectMapper(){
        return new ObjectMapper();
    }

    /**
     * Bean initialization
     * @return Config validator
     */
    @Bean
    @Scope("singleton")
    public ConfigValidator getConfigValidator(){
        return new ConfigValidator();
    }
}