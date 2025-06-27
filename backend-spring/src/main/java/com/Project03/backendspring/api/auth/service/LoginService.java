package com.Project03.backendspring.api.auth.service;

import com.Project03.backendspring.api.auth.repository.AuthRepository;
import com.Project03.backendspring.config.PasswordEncoderConfig;
import com.Project03.backendspring.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {
    private final AuthRepository authRepository;
    private final PasswordEncoderConfig passwordEncoderConfig;

    public boolean login(String username, String password) {
        Optional<UserEntity> userOptional  = authRepository.findByUsername(username);
        log.info(password);
        if(userOptional.isEmpty()){
            return false;
        }
        if(!passwordEncoderConfig.passwordEncoder().matches(password,userOptional.get().getPassword())){
            log.info("비밀번호 불일치");
            return false;
        }
        log.info("비밀번호 일치");
        return true;
    }
}
