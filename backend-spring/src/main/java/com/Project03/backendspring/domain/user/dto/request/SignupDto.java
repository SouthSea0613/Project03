package com.Project03.backendspring.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SignupDto {
    private String username;
    private String password;
    private String name;
    private String email;
    private String postcode;
    private String address;
    private String detailAddress;
}
