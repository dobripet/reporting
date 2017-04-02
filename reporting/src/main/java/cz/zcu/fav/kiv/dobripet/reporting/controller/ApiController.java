package cz.zcu.fav.kiv.dobripet.reporting.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

/**
 * Created by Petr on 3/4/2017.
 */
@RestController
@RequestMapping(value = "/api")
public class ApiController {
    private ObjectMapper mapper;
    private Config config;

    public ApiController() {
        System.out.println("tedka nechapu co se deje");
        mapper = new ObjectMapper();
        try {
            config = mapper.readValue((new ClassPathResource("reporting-config.json")).getFile(), Config.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/test")
    public String getApi(){
        System.out.println("necoprislo");
        return "{\"asdasd\": 15}";
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/entities")
    public String getEntities(){
        System.out.println("entities");
        try {
            return mapper.writeValueAsString(config.getEntities());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }
}
