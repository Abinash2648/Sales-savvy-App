package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.enities.Category;
import com.example.demo.enities.Product;
import com.example.demo.enities.ProductImage;
import com.example.demo.repositories.CatagoryRepository;
import com.example.demo.repositories.ProductImageRepository;
import com.example.demo.repositories.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private ProductImageRepository productImageRepo;

    @Autowired
    private CatagoryRepository catagoryRepo;

    public List<Product> getProductsByCategory(String categoryName) {
        if (categoryName != null && !categoryName.isEmpty()) {
            Optional<Category> categoryOpt = catagoryRepo.findByCategoryName(categoryName);
            if (categoryOpt.isPresent()) {
                Category category = categoryOpt.get();
                return productRepo.findByCategory_CategoryId(category.getCategoryId());
            } else {
                throw new RuntimeException("Category not found");
            }
        } else {
            return productRepo.findAll();
        }
    }

    public List<String> getProductImages(Integer productId) {
        List<ProductImage> productImages = productImageRepo.findByProduct_ProductId(productId);
        List<String> imageUrls = new ArrayList<>();
        for (ProductImage image : productImages) {
            imageUrls.add(image.getImageUrl());
        }
        return imageUrls;
    }
}
	
	


