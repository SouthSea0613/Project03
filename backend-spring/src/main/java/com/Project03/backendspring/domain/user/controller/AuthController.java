package com.Project03.backendspring.domain.user.controller;


import com.Project03.backendspring.common.dto.response.MessageDto;
import com.Project03.backendspring.domain.user.dto.request.LoginDto;
import com.Project03.backendspring.domain.user.dto.request.SignUpDto;
import com.Project03.backendspring.domain.user.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<MessageDto> signup(@RequestBody SignUpDto signUpDto) {
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
    public ResponseEntity<MessageDto> login(@RequestBody LoginDto loginDto,HttpServletResponse httpServletResponse) {
        try {
            String token = authService.login(loginDto);
            httpServletResponse.setHeader("Authorization", token);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageDto(true, "로그인 성공"));
        } catch (IllegalArgumentException e) {
            log.info("테스트");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDto(false, "로그인 실패"));
        }
    }
    @PostMapping("/user/me")
    public ResponseEntity<MessageDto> getUserInfo(@AuthenticationPrincipal UserDetails userDetails){
//        String username = userDetails.getUsername();
//        SignupRequestDto user = userDetails.getUsername()
        return ResponseEntity.ok(new MessageDto(true,"유효한 토큰 & user 정보 조회"));
    }
    @PostMapping("/checkUsername")
    @ResponseBody
    public ResponseEntity<MessageDto> checkusername(@RequestBody SignUpDto signUpDto) {
        if(signUpDto.getUsername() == null){
            MessageDto responseDto = new MessageDto();
            return ResponseEntity.badRequest().body(responseDto);
        }
        try{
            boolean isAvailable = authService.checkUsername(signUpDto.getUsername());
            String message = isAvailable?"사용 가능한 아이디입니다.":"이미 사용중인 아이디입니다.";
            MessageDto responseDto = new MessageDto(isAvailable,message);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            MessageDto responseDto = new MessageDto(false,"아이디 중복 확인 중 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

}