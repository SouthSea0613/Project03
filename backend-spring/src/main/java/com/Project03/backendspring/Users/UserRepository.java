package com.Project03.backendspring.Users;

import com.Project03.backendspring.dto.UserDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select count(*) >0 from User where username = ?1")
    boolean checkusername(String username);

}
