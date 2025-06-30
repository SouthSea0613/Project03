package com.Project03.backendspring.domain.test;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")
public class TestService {
    public String test() {
        return "SpringBoot.TestService에서 보낸 메시지입니다";
    }
}
