package cz.zcu.fav.kiv.dobripet.reporting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * ReportingController catches all request that aren't processed by resource handler or ApiController
 * Serves index page with react application
 *
 * Created by Petr on 2/20/2017.
 */
@Controller
public class ReportingController {

    /**
     * Handles requests for any mapping (/**)
     * @return JSP template
     */
    @GetMapping("/**")
    public String getIndex(){
        return "index";
    }
}