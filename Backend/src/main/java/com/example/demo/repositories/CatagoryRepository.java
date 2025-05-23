package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.enities.Category;

@Repository
public interface CatagoryRepository extends JpaRepository<Category, Integer> {
	
	public Optional<Category> findByCategoryName(String categoryName);
	

}
