/**
 * Created by Petr on 2/20/2017.
 */
package cz.zcu.fav.kiv.dobripet.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Servlet implementation class FrontController
 */
@Controller
@RequestMapping("/")
public class FrontController{
    @GetMapping
    public String getIndex(){
        return "index";
    }

}