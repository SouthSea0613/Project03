package com.Project03.backendspring.api.auth.service;

import com.Project03.backendspring.api.auth.repository.AuthRepository;
import com.Project03.backendspring.config.PasswordEncoderConfig;
import com.Project03.backendspring.entity.UserEntity;
import com.Project03.backendspring.jwt.JwtUtil;
import io.jsonwebtoken.Jwt;
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
    private final JwtUtil jwtUtil;
    public String login(String username, String password) {
        Optional<UserEntity> userOptional  = authRepository.findByUsername(username);
        log.info("비밀번호:{}",password);
        if(userOptional.isEmpty()){
            return null;
        }
        if(!passwordEncoderConfig.passwordEncoder().matches(password,userOptional.get().getPassword())){
            log.info("비밀번호 불일치");
            return null;
        }
        log.info("비밀번호 일치");
        String token = jwtUtil.createToken(username, userOptional.get().getRole());
        return token;
    }
}
