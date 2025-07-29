package com.filestorage;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody Map<String, String> request){
        try {
            
        
        
            String email = request.get("email");
            String password = request.get("password");

            if(userRepository.existsByEmail(email)){
                User user = userRepository.findByEmail(email).get();

                if(user.getPassword().equals(password)){
                    String newToken = jwtService.generateToken(email);
                    LoginResponse response = new LoginResponse(newToken);

                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.badRequest().body("Incorrect email or password.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Map<String, String> request){

        String email = request.get("email");
        String password = request.get("password");
        User newUser = new User(email, password);

        if(userRepository.existsByEmail(email)){
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        userRepository.save(newUser);
        return ResponseEntity.ok("Sign up successful.");
    }
}
