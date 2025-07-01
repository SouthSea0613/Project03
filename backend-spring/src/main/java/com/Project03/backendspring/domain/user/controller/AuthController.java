package com.Project03.backendspring.domain.user.controller;

import com.Project03.backendspring.common.dto.MessageDto;
import com.Project03.backendspring.domain.user.dto.request.LoginDto;
import com.Project03.backendspring.domain.user.dto.request.SignupDto;
import com.Project03.backendspring.domain.user.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<MessageDto> signup(@RequestBody SignupDto signUpDto) {
        try {
            if(authService.signup(signUpDto)) {
                return ResponseEntity.status(HttpStatus.CREATED).body(new MessageDto(true, "회원가입 성공"));
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDto(false, "잘못된 요청"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageDto(false, "통신 에러"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto requestDto, HttpServletResponse response) {
        try {
            String token = authService.login(requestDto);
            response.addHeader("Authorization", token);
            return ResponseEntity.ok("로그인 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    @PostMapping("/user/me")
    public ResponseEntity<MessageDto> getUserInfo(@AuthenticationPrincipal UserDetails userDetails){
//        String username = userDetails.getUsername();
//        SignupRequestDto user = userDetails.getUsername()
        return ResponseEntity.ok(new MessageDto(true,"유효한 토큰 & user 정보 조회"));
    }
}