package com.Project03.backendspring.domain.user.controller;


import com.Project03.backendspring.common.dto.response.ApiResponseDto;
import com.Project03.backendspring.common.dto.response.MessageDto;
import com.Project03.backendspring.domain.user.dto.request.LoginDto;
import com.Project03.backendspring.domain.user.dto.request.SignUpDto;
//import com.Project03.backendspring.domain.user.entity.User;
import com.Project03.backendspring.domain.user.dto.response.UserInfoDto;
import com.Project03.backendspring.domain.user.entity.User;
import com.Project03.backendspring.domain.user.service.AuthService;
import com.Project03.backendspring.domain.user.service.UserDetailsImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
            log.info("signup");
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
            ResponseCookie cookie = ResponseCookie.from("token",token)
                    .maxAge(3600)
                    .path("/")
                    .secure(true)
                    .httpOnly(true)
                    .sameSite("None")
                    .build();
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString()) // 헤더에 직접 쿠키 설정
                    .body(new MessageDto(true, "로그인 성공"));
        } catch (IllegalArgumentException e) {
            log.info("테스트");
            log.error("### 로그인 실패! [Controller Catch] - 원인: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDto(false, "로그인 실패"));
        }
    }
    @GetMapping("/user/me")
    public ResponseEntity<ApiResponseDto> getUserInfo(@AuthenticationPrincipal UserDetailsImpl userDetails){
        User user = userDetails.getUser();
        UserInfoDto userInfoDto = new UserInfoDto(user.getUsername(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(new ApiResponseDto(true,"유효한 토큰 & user 정보 조회",userInfoDto));
    }
    @PostMapping("/checkUsername")
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

    @PostMapping("/checkEmail")
    public ResponseEntity<MessageDto> checkEmail(@RequestBody SignUpDto signUpDto) {
        if(signUpDto.getEmail() == null){
            return ResponseEntity.badRequest().body(new MessageDto(false,"잘못된 요청"));
        }
        try{
            boolean isAvailable = authService.checkEmail(signUpDto.getEmail());
            String message = isAvailable?"사용 가능한 이메일입니다.":"이미 사용중인 이메일입니다.";
            return ResponseEntity.ok(new MessageDto(isAvailable,message));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageDto(false,"아이디 중복 확인 중 오류 발생"));
        }
    }

}