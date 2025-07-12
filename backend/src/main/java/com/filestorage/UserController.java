package com.filestorage;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody Map<String, String> request){
        //Map turns the Json information into key-value pairs
        String email = request.get("email");
        String password = request.get("password");
       

        if(userRepository.existsByEmail(email)){
            User user = userRepository.findByEmail(email).get();

            if(user.getPassword().equals(password)){
                return ResponseEntity.ok("Login Successful.");
            }
        }
        return ResponseEntity.badRequest().body("Incorrect email or password");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Map<String, String> request){

        String email = request.get("email");
        String password = request.get("password");
        User newUser = new User(email, password);

        if(userRepository.existsByEmail(email)){
            System.out.println("User already in use.");
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        userRepository.save(newUser);
        System.out.println("User added to database.");
        return ResponseEntity.ok("Sign up successful.");
    }
}
