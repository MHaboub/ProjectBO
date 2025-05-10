package com.gestionformation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestionformation.models.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    List<User> findAllByOrderByLastNameAsc();

    User findByIdAndDeletedFalse(Long id);

    List<User> findByDeletedFalse();
}
