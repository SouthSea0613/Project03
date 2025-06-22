package com.Project03.backendspring.controller;

import com.Project03.backendspring.Users.User;
import com.Project03.backendspring.dto.UserDto;
import com.Project03.backendspring.dto.response.ApiResponseDto;
import com.Project03.backendspring.dto.response.CheckUsernameResponseDto;
import com.Project03.backendspring.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;


    @GetMapping("/signup")
    public String signup() {
        return "/signup";
    }

    @PostMapping("/api/signup")
    @ResponseBody
    public ResponseEntity<ApiResponseDto> signup(@RequestBody UserDto userDto) {
        log.info("회원가입 컨트롤러");
        if(userDto==null){
            ApiResponseDto apiResponseDto = new ApiResponseDto(false,"에러");
            return ResponseEntity.badRequest().body(apiResponseDto);
        }
        try{
            log.info("회원가입 try");
            User userinfo = userService.signup(userDto);
            if(userinfo==null){
                log.info("회원가입 실패");
                ApiResponseDto apiResponseDto = new ApiResponseDto(true,"회원가입 실패");
                return ResponseEntity.ok(apiResponseDto);
            }
            log.info("회원가입 성공");
            ApiResponseDto apiResponseDto = new ApiResponseDto(true,"회원가입 성공");
            return ResponseEntity.ok(apiResponseDto);
        }catch (Exception e){
            System.err.println(e.getMessage());
            ApiResponseDto apiResponseDto = new ApiResponseDto(false,"서버 에러");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponseDto);
        }
    }

    @PostMapping("/api/checkUsername")
    @ResponseBody
    public ResponseEntity<CheckUsernameResponseDto> checkusername(@RequestBody UserDto userDto) {
        if(userDto.getUsername() == null){
            CheckUsernameResponseDto responseDto = new CheckUsernameResponseDto();
            return ResponseEntity.badRequest().body(responseDto);
        }
        try{
            boolean isAvailable = userService.checkUsername(userDto.getUsername());
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
