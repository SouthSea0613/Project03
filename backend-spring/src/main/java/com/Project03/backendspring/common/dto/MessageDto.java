package com.Project03.backendspring.common.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class MessageDto {
        private boolean success;
        private String message;
}
