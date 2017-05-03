package cz.zcu.fav.kiv.dobripet.reporting.controller;

import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.annotation.PostConstruct;

/**
 * Created by Petr on 2/20/2017.
 *
 * ReportingController catches all request that aren't processed by resource handler or ApiController
 * Serves index page with react application
 */
@Controller
public class ReportingController {
    @Autowired
    private Config config;

    /**
     * Handles requests for any mapping (/**)
     * @return JSP template
     */
    @GetMapping("/**")
    public String getIndex(){
        return "index";
    }

    @PostConstruct
    private void InitConfig(){
        System.out.println("bean2 conf " + config);
    }
}