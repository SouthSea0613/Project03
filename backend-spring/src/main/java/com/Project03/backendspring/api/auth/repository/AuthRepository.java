package com.Project03.backendspring.api.auth.repository;

import com.Project03.backendspring.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<UserEntity, Integer> {

    @Query("select count(*) >0 from UserEntity where username = ?1")
    boolean checkUsername(String username);

    @Query("select u from UserEntity u where u.username = ?1")
    Optional<UserEntity> findByUsername(String username);
}
