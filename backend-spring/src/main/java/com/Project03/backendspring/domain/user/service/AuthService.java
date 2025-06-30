package com.Project03.backendspring.domain.user.service;

import com.Project03.backendspring.domain.user.dto.AuthRequestDto;
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
    public void signup(AuthRequestDto.Signup requestDto) {
        if (userRepository.existsByUsername(requestDto.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
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
    }

    public String login(AuthRequestDto.Login requestDto) {
        User user = userRepository.findByUsername(requestDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.createToken(user.getUsername(), user.getUserRole().name());
    }
}