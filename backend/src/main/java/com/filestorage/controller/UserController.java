package com.filestorage.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filestorage.User;
import com.filestorage.UserRepository;
import com.filestorage.dto.RegisterUserDto;
import com.filestorage.dto.VerifyUserDto;
import com.filestorage.service.AuthenticationService;
import com.filestorage.service.JwtService;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, JwtService jwtService, AuthenticationService authenticationService, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody Map<String, String> request){
        try {
        
            String email = request.get("email");
            String password = request.get("password");
            
            System.out.println("Login attempt for email: " + email);

            if(userRepository.existsByEmail(email)){
                User user = userRepository.findByEmail(email).get();
                
                System.out.println("User found: " + user.getEmail());
                System.out.println("User enabled: " + user.isEnabled());
                
                boolean matches = passwordEncoder.matches(password, user.getPassword());
                System.out.println("Password matches: " + matches);

                if(matches && user.isEnabled()){ 
                    System.out.println("Login successful - generating token");
                    String newToken = jwtService.generateToken(email);
                    System.out.println("Token generated successfully");
                    return ResponseEntity.ok(Map.of("token", newToken));
                } else {
                    System.out.println("Login failed - Password match: " + matches + ", User enabled: " + user.isEnabled());
                }
            } else {
                System.out.println("User not found with email: " + email);
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect email or password."));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Map<String, String> request){
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if(userRepository.existsByEmail(email)){
                return ResponseEntity.badRequest().body("Email already in use.");
            }
            
            // Create RegisterUserDto for the authentication service
            RegisterUserDto registerDto = new RegisterUserDto();
            registerDto.setEmail(email);
            registerDto.setPassword(password);
            
            // Use AuthenticationService which handles:
            // - Password encoding
            // - Verification code generation
            // - Email sending
            // - Setting user as disabled until verified
            authenticationService.signup(registerDto);
            
            return ResponseEntity.ok("Sign up successful.");
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Signup failed: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> request){
        try {
            String verificationCode = request.get("verificationCode");
            Optional<User> user = userRepository.findByVerificationCode(verificationCode);

            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid verification code."));
            }

            String email = user.get().getEmail();
            
            VerifyUserDto verifyDto = new VerifyUserDto();
            verifyDto.setEmail(email);
            verifyDto.setVerificationCode(verificationCode);
            
            authenticationService.verifyUser(verifyDto);
            
            return ResponseEntity.ok(Map.of("response", "Account verified successfully. You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request){
        try {
            String email = request.get("email");
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code resent. Please check your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to resend verification: " + e.getMessage());
        }
    }
}
