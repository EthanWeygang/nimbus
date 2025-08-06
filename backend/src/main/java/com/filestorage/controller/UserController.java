package com.filestorage.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.filestorage.User;
import com.filestorage.UserRepository;
import com.filestorage.dto.RegisterUserDto;
import com.filestorage.dto.VerifyUserDto;
import com.filestorage.service.AuthenticationService;
import com.filestorage.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;


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

    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> loginOptions() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody Map<String, String> request, HttpServletRequest httpRequest){
        try {
            // Log request details for debugging
            // System.out.println("=== LOGIN REQUEST DEBUG ===");
            // System.out.println("Request URI: " + httpRequest.getRequestURI());
            // System.out.println("Request Method: " + httpRequest.getMethod());
            // System.out.println("Remote Address: " + httpRequest.getRemoteAddr());
            // System.out.println("X-Forwarded-For: " + httpRequest.getHeader("X-Forwarded-For"));
            // System.out.println("X-Real-IP: " + httpRequest.getHeader("X-Real-IP"));
            // System.out.println("Host: " + httpRequest.getHeader("Host"));
            // System.out.println("User-Agent: " + httpRequest.getHeader("User-Agent"));
        
            String email = request.get("email");
            String password = request.get("password");
            
            // System.out.println("Login attempt for email: " + email);

            if(userRepository.existsByEmail(email)){
                User user = userRepository.findByEmail(email).get();
                
                // System.out.println("User found: " + user.getEmail());
                // System.out.println("User enabled: " + user.isEnabled());
                
                boolean matches = passwordEncoder.matches(password, user.getPassword());
                // System.out.println("Password matches: " + matches);

                if(matches && user.isEnabled()){ 
                    // System.out.println("Login successful - generating token");
                    String newToken = jwtService.generateToken(email);
                    // System.out.println("Token generated successfully");
                    return ResponseEntity.ok(Map.of("token", newToken));
                } else {
                    System.err.println("Login failed - Password match: " + matches + ", User enabled: " + user.isEnabled());
                }
            } else {
                System.err.println("User not found with email: " + email);
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
                return ResponseEntity.badRequest().body(Map.of("error", "Email already in use."));
            }
            
            // Create RegisterUserDto for the authentication service
            RegisterUserDto registerDto = new RegisterUserDto();
            registerDto.setEmail(email);
            registerDto.setPassword(password);
            
            authenticationService.signup(registerDto);
            
            return ResponseEntity.ok(Map.of("response", "Signup successful."));

        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Signup failed: " + e.getMessage()));
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

    // Not implemented yet
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request){
        try {
            String email = request.get("email");
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok(Map.of("response", "Verification code resent. Please check your email."));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Verification Resend Failed: " + e.getMessage()));
        }
    }
}
