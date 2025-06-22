package com.Project03.backendspring.Users;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name =  "\"user\"")
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    @Column(length = 50, nullable = false)
    private String username;

    @Column(length = 255, nullable = false)
    private String password;
    @Column(length = 100, nullable = false)
    private String email;
    @Column(length = 10, nullable = false)
    private String postcode;

    @Column(length = 255, nullable = false)
    private String address;

    @Column(length = 255, nullable = false)
    private String detail_address;

    @Column(length = 20, nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'USER'")
    private String role;
}
