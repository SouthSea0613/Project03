package com.Project03.backendspring.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

public class AuthRequestDto {
    @Getter
    @Setter
    public static class Signup {
        private String username;
        private String password;
        private String name;
        private String email;
        private String postcode;
        private String address;
        private String detailAddress;
    }

    @Getter
    @Setter
    public static class Login {
        private String username;
        private String password;
    }
}