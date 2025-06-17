package com.Project03.backendspring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {
    @GetMapping("/api/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Spring Boot에서 보낸 메시지입니다");
    }
}
