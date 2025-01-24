package com.crivelaro.form.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = {
            "/",
            "/register",
            "/login",
            "/profile",
    })
    public String redirect() { return "forward:/index.html";}
}
