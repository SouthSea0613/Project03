package com.Project03.backendspring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.internal.build.AllowSysOut;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckUsernameResponseDto {
    private Boolean isAvailable;
    private String message;
}
