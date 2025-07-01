package com.Project03.backendspring.domain.user.service;

import com.Project03.backendspring.domain.user.dto.request.LoginDto;
import com.Project03.backendspring.domain.user.dto.request.SignupDto;
import com.Project03.backendspring.domain.user.entity.User;
import com.Project03.backendspring.domain.user.entity.UserRole;
import com.Project03.backendspring.domain.user.repository.UserRepository;
import com.Project03.backendspring.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public boolean signup(SignupDto requestDto) {
        try {
            if (userRepository.existsByUsername(requestDto.getUsername())) {
                return false;
            }
            if (userRepository.existsByEmail(requestDto.getEmail())) {
                return false;
            }

            String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

            User user = User.builder()
                    .username(requestDto.getUsername())
                    .password(encodedPassword)
                    .name(requestDto.getName())
                    .email(requestDto.getEmail())
                    .postcode(requestDto.getPostcode())
                    .address(requestDto.getAddress())
                    .detailAddress(requestDto.getDetailAddress())
                    .userRole(UserRole.USER) // 기본 역할은 USER
                    .build();
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }

    }

    public String login(LoginDto requestDto) {
        User user = userRepository.findByUsername(requestDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.createToken(user.getUsername(), user.getUserRole().name());
    }
}