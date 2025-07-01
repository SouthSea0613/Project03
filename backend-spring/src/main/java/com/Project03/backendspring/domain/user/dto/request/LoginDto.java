package com.Project03.backendspring.domain.user.dto.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class LoginDto {
        private String username;
        private String password;
}