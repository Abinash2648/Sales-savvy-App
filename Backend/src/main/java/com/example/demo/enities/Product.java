package com.example.demo.enities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name="products")
public class Product {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer productId;
	@Column(nullable = false)
	private String name;
	@Column(columnDefinition = "TEXT")
	private String description;
	@Column(nullable = false,precision=10,scale=2)
	private BigDecimal price;
	@Column(nullable = false)
	private int stock;
	@ManyToOne
	@JoinColumn(name="category_id")
	private Category category;
	@Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime createdAt;
	@Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
	private LocalDateTime updatedAt;
	public Product() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Product(Integer productId, String name, String description, BigDecimal price, int stock, Category category,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.productId = productId;
		this.name = name;
		this.description = description;
		this.price = price;
		this.stock = stock;
		this.category = category;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
	public Product(String name, String description, BigDecimal price, int stock, Category category,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.name = name;
		this.description = description;
		this.price = price;
		this.stock = stock;
		this.category = category;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
	public Integer getProductId() {
		return productId;
	}
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int stock) {
		this.stock = stock;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}
	public LocalDateTime getCreateAt() {
		return createdAt;
	}
	public void setCreateAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdateAt() {
		return updatedAt;
	}
	public void setUpdateAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	

}
