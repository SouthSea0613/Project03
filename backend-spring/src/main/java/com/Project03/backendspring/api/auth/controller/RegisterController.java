package com.Project03.backendspring.api.auth.controller;

import com.Project03.backendspring.api.auth.service.RegisterService;
import com.Project03.backendspring.dto.UserDto;
import com.Project03.backendspring.dto.response.ApiResponseDto;
import com.Project03.backendspring.dto.response.CheckUsernameResponseDto;
import com.Project03.backendspring.entity.UserEntity;
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
public class RegisterController {
    private final RegisterService registerService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto> signup(@RequestBody UserDto userDto) {
        log.info("회원가입 컨트롤러");
        if(userDto==null){
            ApiResponseDto apiResponseDto = new ApiResponseDto(false,"에러",null);
            return ResponseEntity.badRequest().body(apiResponseDto);
        }
        try{
            log.info("회원가입 try");
            UserEntity userinfo = registerService.signup(userDto);
            if(userinfo==null){
                log.info("회원가입 실패");
                ApiResponseDto apiResponseDto = new ApiResponseDto(true,"회원가입 실패",null);
                return ResponseEntity.ok(apiResponseDto);
            }
            log.info("회원가입 성공");
            ApiResponseDto apiResponseDto = new ApiResponseDto(true,"회원가입 성공",null);
            return ResponseEntity.ok(apiResponseDto);
        }catch (Exception e){
            System.err.println(e.getMessage());
            ApiResponseDto apiResponseDto = new ApiResponseDto(false,"서버 에러",null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponseDto);
        }
    }

    @PostMapping("/checkUsername")
    public ResponseEntity<CheckUsernameResponseDto> checkUsername(@RequestBody UserDto userDto) {
        if(userDto.getUsername() == null){
            CheckUsernameResponseDto responseDto = new CheckUsernameResponseDto();
            return ResponseEntity.badRequest().body(responseDto);
        }
        try{
            boolean isAvailable = registerService.checkUsername(userDto.getUsername());
            String message = isAvailable?"사용 가능한 아이디입니다.":"이미 사용중인 아이디입니다.";
            CheckUsernameResponseDto responseDto = new CheckUsernameResponseDto(isAvailable,message);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            CheckUsernameResponseDto responseDto = new CheckUsernameResponseDto(false,"아이디 중복 확인 중 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }
}
