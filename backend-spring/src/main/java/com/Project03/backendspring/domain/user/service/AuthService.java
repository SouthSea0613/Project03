package com.Project03.backendspring.domain.user.service;

import com.Project03.backendspring.domain.user.dto.request.LoginDto;
import com.Project03.backendspring.domain.user.dto.request.SignUpDto;
import com.Project03.backendspring.domain.user.entity.User;
import com.Project03.backendspring.domain.user.entity.UserRole;
import com.Project03.backendspring.domain.user.repository.UserRepository;
import com.Project03.backendspring.jwt.JwtDto;
import com.Project03.backendspring.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public JwtDto login(LoginDto loginDto) {
        User user = userRepository
                .findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }else{
            String accessToken = jwtUtil.createAccessToken(user.getUsername(),user.getUserRole().name());
            String refreshToken = jwtUtil.createRefreshToken(user.getUsername(),user.getUserRole().name());
            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            return new JwtDto(refreshToken, accessToken);
        }
    }

    public boolean checkUsername(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean checkEmail(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Transactional
    public void logout(String username) {
        userRepository.updateRefreshToken(username);
    }

    public String createNewAccessToken(String refreshToken) {
        Claims claims = jwtUtil.getUserInfoFromToken(refreshToken);
        String username = claims.getSubject();
        String role = claims.get("role", String.class);
        return jwtUtil.createAccessToken(username, role);
    }

    public boolean validateToken(String refreshToken) {
        return jwtUtil.validateToken(refreshToken);
    }

    public boolean checkRefreshToken(String refreshToken) {
        Claims claims = jwtUtil.getUserInfoFromToken(refreshToken);
        String username = claims.getSubject();
        String storedRefreshToken = userRepository.findRefreshToken(username);
        return refreshToken.equals(storedRefreshToken);
    }
}