package com.Project03.backendspring.domain.user.service;

import com.Project03.backendspring.domain.user.dto.request.LoginDto;
import com.Project03.backendspring.domain.user.dto.request.SignUpDto;
import com.Project03.backendspring.domain.user.entity.User;
import com.Project03.backendspring.domain.user.entity.UserRole;
import com.Project03.backendspring.domain.user.repository.UserRepository;
import com.Project03.backendspring.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public boolean signup(SignUpDto signUpDto) {
        try {
            if (userRepository.existsByUsername(signUpDto.getUsername())) {
                return false;
            }

            if (userRepository.existsByEmail(signUpDto.getEmail())) {
                return false;
            }

            User user = User.builder()
                    .username(signUpDto.getUsername())
                    .password(passwordEncoder.encode(signUpDto.getPassword()))
                    .name(signUpDto.getName())
                    .email(signUpDto.getEmail())
                    .postcode(signUpDto.getPostcode())
                    .address(signUpDto.getAddress())
                    .detailAddress(signUpDto.getDetail_address())
                    .userRole(UserRole.USER)
                    .build();
            log.info(user.toString());
            userRepository.save(user);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
    @Transactional
    public Map<String, String> login(LoginDto loginDto) {
        User user = userRepository
                .findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        if (!userRepository.existsByRefreshToken(loginDto.getUsername())) {
            String accessToken = jwtUtil.createAccessToken(user.getUsername(),user.getUserRole().name());
            String refreshToken = jwtUtil.createRefreshToken(user.getUsername(),user.getUserRole().name());
            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            Map<String,String> tokens = new HashMap<>();
            tokens.put("accessToken",accessToken);
            tokens.put("refreshToken",refreshToken);

            return tokens;
        }
        return null;
    }

    public boolean checkUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            return false;
        }
        return true;
    }

    public boolean checkEmail(String email) {
        if(userRepository.existsByEmail(email)) {
            return false;
        }
        return true;
    }

    @Transactional
    public void logout(String username) {
        // DB에 저장된 사용자의 Refresh Token을 null로 업데이트
        userRepository.updateRefreshToken(username);
    }
}