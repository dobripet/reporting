package cz.zcu.fav.kiv.dobripet.reporting.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import java.io.IOException;
import java.util.List;

/**
 * Spring configuration
 *
 * Created by Petr on 2/26/2017.
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "cz.zcu.fav.kiv.dobripet")
@EnableTransactionManagement
@PropertySource("classpath:application.properties")
public class SpringConfiguration extends WebMvcConfigurerAdapter {

    private Logger log = LoggerFactory.getLogger(SpringConfiguration.class);


    @Value("${spring.jackson.serialization.WRITE_DATES_AS_TIMESTAMPS}")
    private boolean writeDatesAsTimestamps;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/js/**").addResourceLocations("/resources/js/");
        registry.addResourceHandler("/css/**").addResourceLocations("/resources/css/");
        registry.addResourceHandler("/fonts/**").addResourceLocations("/resources/fonts/");
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

    /**
     * enables Value annotation in controller to get application.properties values
     */
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    /**
     * enabled JSON converters and object mappers
     *
     * @param converters
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter jacksonMessageConverter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = jacksonMessageConverter.getObjectMapper();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, writeDatesAsTimestamps);
        converters.add(jacksonMessageConverter);
    }


    /**
     * Reads config from reporting-config.json.
     * Initialize documentation
     *
     * @return configuration for reporting module
     */
    @Bean
    @Scope("singleton")
    public Config getConfig() {
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
     *
     * @return reporting initializer
     */
    @Bean
    @Scope("singleton")
    public ReportingInitializer getReportingInitializer() {
        return new ReportingInitializer();
    }


    /**
     * Bean initialization
     *
     * @return JSON object mapper
     */
    @Bean
    @Scope("singleton")
    public ObjectMapper getObjectMapper() {
        return new ObjectMapper();
    }

    /**
     * Bean initialization
     *
     * @return Config validator
     */
    @Bean
    @Scope("singleton")
    public ConfigValidator getConfigValidator() {
        return new ConfigValidator();
    }
}