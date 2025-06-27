package com.Project03.backendspring.api.auth.controller;

import com.Project03.backendspring.api.auth.service.LoginService;
import com.Project03.backendspring.dto.UserDto;
import com.Project03.backendspring.dto.response.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            return ResponseEntity.badRequest().body(new ApiResponseDto(false,"에러"));
        }
        log.info("로그인 컨트롤러");
        try{
            boolean isSuccess  = loginService.login(userDto.getUsername(),userDto.getPassword());
            if(isSuccess){
                return ResponseEntity.ok(new ApiResponseDto(true,"로그인 성공"));
            }
            return ResponseEntity.ok(new ApiResponseDto(false,"로그인 실패"));

        }catch (Exception e){
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponseDto(false,"서버 에러"));
        }

    }
}
