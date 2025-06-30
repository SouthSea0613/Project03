package com.Project03.backendspring.api.auth.controller;

import com.Project03.backendspring.api.auth.service.LoginService;
import com.Project03.backendspring.dto.UserDto;
import com.Project03.backendspring.dto.response.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LoginController {
    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto> login(@RequestBody UserDto userDto){
        if(userDto.getUsername() == null | userDto.getPassword() == null){
            return ResponseEntity.badRequest().body(new ApiResponseDto(false,"에러",null));
        }
        log.info("로그인 컨트롤러");
        try{
            log.info("컨트롤러 비밀번호:{}",userDto.getPassword());
            String userToken  = loginService.login(userDto.getUsername(),userDto.getPassword());
            if(userToken !=null){
                return ResponseEntity.ok(new ApiResponseDto(true,"로그인 성공",userToken));
            }

            return ResponseEntity.ok(new ApiResponseDto(false,"로그인 실패",null));

        }catch (Exception e){
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponseDto(false,"서버 에러",null));
        }

    }
    @PostMapping("/user/me")
    public ResponseEntity<ApiResponseDto> getUserInfo(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        return ResponseEntity.ok(new ApiResponseDto(true,"유효한 토큰 & user 정보 조회",username));
    }
}
