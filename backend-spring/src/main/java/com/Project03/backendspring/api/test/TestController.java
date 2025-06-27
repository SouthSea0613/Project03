package com.Project03.backendspring.api.test;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Profile("dev")
public class TestController {
    private final TestService testService;

    @GetMapping("/api/test")
    public ResponseEntity<Map<String, String>> hello() {
        return ResponseEntity.ok(Map.of("message", "Spring Boot.TestController에서 보낸 메시지입니다. " + testService.hello()));
    }
}
