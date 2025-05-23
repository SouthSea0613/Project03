package com.Project03.back_end.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class controller {

    @GetMapping("/api/test")
    @ResponseBody
    public String test(){
        return "테스트입니다";
    }
}
