package com.Project03.backendspring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain = true)
public class UserDto {
    private Integer user_id;
    private String username;
    private String password;
    private String email;
    private String postcode;
    private String address;
    private String detail_address;

}
