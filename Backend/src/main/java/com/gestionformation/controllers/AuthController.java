package com.gestionformation.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.gestionformation.models.User;
import com.gestionformation.models.Role;
import com.gestionformation.services.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        logger.debug("Login attempt for username: {}", credentials.get("username"));
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            logger.warn("Login attempt with missing credentials");
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }

        User user = userService.findByUsername(username);

        if (user == null) {
            logger.warn("Login attempt with non-existent username: {}", username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        if (passwordEncoder.matches(password, user.getPassword()) && username.equals(user.getUsername())) {
            logger.info("Successful login for user: {}", username);
            String token = generateJwtToken(user);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("role", user.getRole());
            return ResponseEntity.ok(response);
        }

        logger.warn("Failed login attempt for user: {}", username);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username or password"));
    }

    private String generateJwtToken(User user) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + 24 * 60 * 60 * 1000)) // 24 hours
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String password = userData.get("password");
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            Role role = Role.valueOf(userData.get("role"));

            User newUser = userService.createUser(username, password, firstName, lastName, role);
            return ResponseEntity.ok(Map.of(
                    "message", "User created successfully",
                    "userId", newUser.getId(),
                    "firstName", newUser.getFirstName(),
                    "lastName", newUser.getLastName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in register: " + e.getMessage()));
        }
    }
}
