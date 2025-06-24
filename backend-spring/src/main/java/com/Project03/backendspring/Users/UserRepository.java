package com.Project03.backendspring.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select count(*) >0 from User where username = ?1")
    boolean checkusername(String username);

    @Query("select u from User u where u.username = ?1")
    Optional<User> findByUsername(String username);
}
