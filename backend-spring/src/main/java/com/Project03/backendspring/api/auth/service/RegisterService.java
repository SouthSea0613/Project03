package com.Project03.backendspring.api.auth.service;

import com.Project03.backendspring.api.auth.repository.AuthRepository;
import com.Project03.backendspring.config.PasswordEncoderConfig;
import com.Project03.backendspring.dto.UserDto;
import com.Project03.backendspring.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterService {
    private final AuthRepository authRepository;
    private final PasswordEncoderConfig passwordEncoderConfig;

    public UserEntity signup(UserDto userDto) {
        String encodedPassword = passwordEncoderConfig.passwordEncoder().encode(userDto.getPassword());
        userDto.setPassword(encodedPassword);

        UserEntity newUserEntity = UserEntity.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .email(userDto.getEmail())
                .postcode(userDto.getPostcode())
                .address(userDto.getAddress())
                .detail_address(userDto.getDetail_address())
                .role("USER")
                .build();
        return authRepository.save(newUserEntity);
    }

    public boolean checkUsername(String username) {
        log.info("서비스");
        return !authRepository.checkUsername(username);
    }
}
