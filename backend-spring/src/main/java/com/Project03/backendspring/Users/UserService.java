package com.Project03.backendspring.Users;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public User signup(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
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

    public boolean login(String username, String password) {
        Optional <User> userOptional  = userRepository.findByUsername(username);
        log.info(password);
        if(userOptional.isEmpty()){
            return false;
        }
        if(!passwordEncoder.matches(password,userOptional.get().getPassword())){
            log.info("비밀번호 불일치");
            return false;
        }
        log.info("비밀번호 일치");
        return true;
    }
}
