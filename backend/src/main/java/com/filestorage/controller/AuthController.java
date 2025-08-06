package com.filestorage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api")
public class AuthController {

    // This is a "do nothing" function. 
    // This is simply here for  the front end to request when they just want to use the Jwt filter to auth a token without affecting perfomance
    @GetMapping("/auth")
    public ResponseEntity authorise(){
        System.out.println("== AuthController HIT ==");
        return ResponseEntity.ok("");
    }
}
