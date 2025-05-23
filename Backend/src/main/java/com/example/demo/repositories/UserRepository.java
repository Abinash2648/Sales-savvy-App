package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.enities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	public Optional<User> findByEmail(String email);
   public  Optional<User> findByUsername(String username);

}
