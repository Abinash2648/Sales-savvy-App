package com.example.demo.services;



import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.enities.JWTToken;
import com.example.demo.enities.User;
import com.example.demo.repositories.JWTTokenRepository;
import com.example.demo.repositories.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
@Service
public class AuthService {

    private final Key SIGNING_KEY;

    private final UserRepository userRepo;
    private final JWTTokenRepository jwtTokenRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    // Injecting jwt.secret from properties file
    @Autowired
    public AuthService(UserRepository userRepo, JWTTokenRepository jwtTokenRepo,
                       @Value("${jwt.secret}") String jwtSecret) {
        this.userRepo = userRepo;
        this.jwtTokenRepo = jwtTokenRepo;
        this.passwordEncoder = new BCryptPasswordEncoder();

        // Ensure the key length is at least 64 bytes
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
            throw new IllegalArgumentException("JWT_SECRET in application.properties must be at least 64 bytes long for HS512.");
        }
        this.SIGNING_KEY = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    public User authenticate(String username, String password) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }

    public String generateToken(User user) {
        String token;
        LocalDateTime currentTime = LocalDateTime.now();
        Optional<JWTToken> existingToken = jwtTokenRepo.findByUserId(user.getUserid());

        if (existingToken.isPresent() && currentTime.isBefore(existingToken.get().getExpiresAt())) {
            token = existingToken.get().getToken();
            System.err.println("Existing valid token found. Returning existing token.");
        } else {
            token = generateNewToken(user);
            if (existingToken.isPresent()) {
                JWTToken oldToken = existingToken.get();
                oldToken.setToken(token);
                oldToken.setExpiresAt(currentTime.plusHours(1));
                jwtTokenRepo.save(oldToken);
                System.err.println("Updated existing token.");
            } else {
                saveToken(user, token);
                System.err.println("Generated and saved new token.");
            }
        }

        System.err.println("Token generated for user: " + user.getUsername());
        return token;
    }

    private String generateNewToken(User user) {
        long expirationTime = System.currentTimeMillis() + 3600000; // 1 hour from now
        System.err.println("Current Time: " + new Date(System.currentTimeMillis()));
        System.err.println("Token Expiration Time: " + new Date(expirationTime));

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(expirationTime))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public void saveToken(User user, String token) {
        JWTToken jwtToken = new JWTToken(user, token, LocalDateTime.now(),LocalDateTime.now().plusHours(1));
        jwtTokenRepo.save(jwtToken);
        System.err.println("Token Saved for User: " + user.getUsername() + " at " + LocalDateTime.now());
        System.err.println("Token Expiration: " + jwtToken.getExpiresAt());
    }

    public void logout(User user) {
        jwtTokenRepo.deleteByUserId(user.getUserid());
    }

    public boolean validateToken(String token) {
        try {
            System.err.println("VALIDATING TOKEN... " + token);

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            System.err.println("Token Parsed Successfully. Claims: " + claims);

            Optional<JWTToken> jwtToken = jwtTokenRepo.findByToken(token);
            if (jwtToken.isPresent()) {
                System.err.println("Token Expiry: " + jwtToken.get().getExpiresAt());
                System.err.println("Current Time: " + LocalDateTime.now());
                return jwtToken.get().getExpiresAt().isAfter(LocalDateTime.now());
            }

            System.err.println("Token Not Found in DB");
            return false;
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}