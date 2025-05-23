package com.example.demo.controllers;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.enities.OrderItem;
import com.example.demo.enities.User;
import com.example.demo.services.PaymentService;
import com.razorpay.RazorpayException;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<String> createPaymentOrder(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("authenticatedUser");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            BigDecimal totalAmount = new BigDecimal(requestBody.get("totalAmount").toString());
            List<Map<String, Object>> cartItemsRaw = (List<Map<String, Object>>) requestBody.get("cartItems");

            List<OrderItem> cartItems = cartItemsRaw.stream().map(item -> {
                OrderItem orderItem = new OrderItem();
                orderItem.setProductId((Integer) item.get("productId"));
                orderItem.setQuantity((Integer) item.get("quantity"));
                BigDecimal pricePerUnit = new BigDecimal(item.get("price").toString());
                orderItem.setPricePerUnit(pricePerUnit);
                orderItem.setTotalPrice(pricePerUnit.multiply(BigDecimal.valueOf(orderItem.getQuantity())));
                return orderItem;
            }).collect(Collectors.toList());

            String razorpayOrderId = paymentService.createOrder(user.getUserid(), totalAmount, cartItems);
            return ResponseEntity.ok(razorpayOrderId);

        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request data: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("authenticatedUser");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            String razorpayOrderId = (String) requestBody.get("razorpayOrderId");
            String razorpayPaymentId = (String) requestBody.get("razorpayPaymentId");
            String razorpaySignature = (String) requestBody.get("razorpaySignature");

            boolean isVerified = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature, user.getUserid());

            return isVerified ?
                ResponseEntity.ok("Payment verified successfully") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying payment: " + e.getMessage());
        }
    }
}
