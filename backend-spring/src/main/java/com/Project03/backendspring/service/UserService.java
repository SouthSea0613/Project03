package com.Project03.backendspring.service;

import com.Project03.backendspring.Users.User;
import com.Project03.backendspring.Users.UserRepository;
import com.Project03.backendspring.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public User signup(UserDto userDto) {
        String encodedPassword = userDto.getPassword();
        userDto.setPassword(encodedPassword);

        User newUserEntity = User.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .email(userDto.getEmail())
                .postcode(userDto.getPostcode())
                .address(userDto.getAddress())
                .detail_address(userDto.getDetail_address())
                .role("USER")
                .build();
        return userRepository.save(newUserEntity);
    }

    public boolean checkUsername(String username) {
        log.info("서비스");
        return !userRepository.checkusername(username);
    }
}
