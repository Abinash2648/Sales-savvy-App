package com.example.demo.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.enities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/cart")
public class CartController {
	
	 @Autowired
	    private CartService cartService;

	    @Autowired
	    private UserRepository userRepository;

	    // Fetch userId from username coming from the filter and get cart item count
	    @GetMapping("/items/count")
	    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	    public ResponseEntity<Integer> getCartItemCount(@RequestParam String username) {
	        // Fetch user by username to get the userId
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

	        // Call the service to get the total cart item count
	        int count = cartService.getCartItemCount(user.getUserid());
	        return ResponseEntity.ok(count);
	    }

	    // Fetch all cart items for the user (based on username)
	    @GetMapping("/items")
	    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	    public ResponseEntity<Map<String, Object>> getCartItems(HttpServletRequest request) {
	        // Fetch user by username to get the userId
	    	User user= (User) request.getAttribute("authenticatedUser");
	    	if (user == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
	     //   User user = userRepository.findByUsername(un)
	       //         .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

	        // Call the service to get cart items for the user
	        Map<String, Object> cartItems = cartService.getCartItems(user.getUserid());
	        cartItems.put("username", user.getUsername());
	        return ResponseEntity.ok(cartItems);
	    }
	    // Add an item to the cart
	    @PostMapping("/add")
	    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	    public ResponseEntity<Void> addToCart(@RequestBody Map<String, Object> request) {
	        String username = (String) request.get("username");
	        int productId = (int) request.get("productId");

	        // Handle quantity: Default to 1 if not provided
	        int quantity = request.containsKey("quantity") ? (int) request.get("quantity") : 1;

	        // Fetch the user using username
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

	        // Add the product to the cart
	        cartService.addToCart(user.getUserid(), productId, quantity);
	        return ResponseEntity.status(HttpStatus.CREATED).build();
	    }

	    // Update Cart Item Quantity
	    @PutMapping("/update")
	    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	    public ResponseEntity<Void> updateCartItemQuantity(@RequestBody Map<String, Object> request) {
	        String username = (String) request.get("username");
	        int productId = (int) request.get("productId");
	        int quantity = (int) request.get("quantity");

	        // Fetch the user using username
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
	        // Update the cart item quantity
	        cartService.updateCartItemQuantity(user.getUserid(), productId, quantity);
	        return ResponseEntity.status(HttpStatus.OK).build();
	    }

	    // Delete Cart Item
	    @DeleteMapping("/delete")
	    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	    public ResponseEntity<Void> deleteCartItem(@RequestBody Map<String, Object> request) {
	        String username = (String) request.get("username");
	        int productId = (int) request.get("productId");

	        // Fetch the user using username
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

	        // Delete the cart item
	        cartService.deleteCartItem(user.getUserid(), productId);
	        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	    }
	

}
