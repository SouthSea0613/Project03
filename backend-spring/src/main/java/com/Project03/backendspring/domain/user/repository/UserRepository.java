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

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.refreshToken = NULL WHERE u.username = ?1")
    void updateRefreshToken(String username);

    @Query("SELECT u.refreshToken from User u where u.username = ?1")
    String findRefreshToken(String username);
}