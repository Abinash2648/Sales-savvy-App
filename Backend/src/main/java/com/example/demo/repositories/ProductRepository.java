package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.enities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
	
	
	List<Product> findByCategory_CategoryId(Integer categoryId);
	 
	 @Query("Select p.category.categoryName From Product p where p.productId= :productId")
	 String findCategoryNameByProductId(int productId);

}
