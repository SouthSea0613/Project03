package com.Project03.backendspring.domain.user.repository;

import com.Project03.backendspring.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User U SET U.refreshToken = :refreshToken WHERE U.username = :username")
    int updateRefreshToken(String username, String refreshToken);

    @Query("SELECT COUNT(u.refreshToken) > 0 FROM User u WHERE u.username = ?1 AND u.refreshToken IS NOT NULL")
    boolean existsByRefreshToken(String username);
}