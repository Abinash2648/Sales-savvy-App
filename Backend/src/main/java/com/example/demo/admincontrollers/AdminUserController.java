package com.example.demo.admincontrollers;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.example.demo.adminservices.AdminUserService;
import com.example.demo.enities.User;

@RestController
@RequestMapping("/admin/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminUserController {
	private final AdminUserService adminUserService;
    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @PutMapping("/modify")
    public ResponseEntity<?> modifyUser(@RequestBody Map<String, Object> userRequest) {
    	 try {
             Integer userId = (Integer) userRequest.get("userId");
             String username = (String) userRequest.get("username");
             String email = (String) userRequest.get("email");
             String role = (String) userRequest.get("role");
             User updatedUser = adminUserService.modifyUser(userId, username, email, role);
             Map<String, Object> response = new HashMap<>();
             response.put("userId", updatedUser.getUserid());
             response.put("username", updatedUser.getUsername());
             response.put("email", updatedUser.getEmail());
             response.put("role", updatedUser.getRole().name());
             response.put("createdAt", updatedUser.getCreatedAt());
             response.put("updatedAt", updatedUser.getUpdatedAt());
             return ResponseEntity.status(HttpStatus.OK).body(response);
         } catch (IllegalArgumentException e) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
         }
    }

    @GetMapping("/getbyid")
    public ResponseEntity<?> getUserById(@RequestBody Map<String, Integer> userRequest) {
    	 try {
             Integer userId = userRequest.get("userId");
             User user = adminUserService.getUserById(userId);
             return ResponseEntity.status(HttpStatus.OK).body(user);
         } catch (IllegalArgumentException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
         }
     }

	
}
