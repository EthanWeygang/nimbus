package com.filestorage.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.filestorage.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String SECRET_KEY;
    @Value("${security.jwt.expiration-time}")
    private long EXP_TIME;

    private final UserRepository userRepository;

    public JwtService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXP_TIME)) // 1 day
                .signWith(getSignInKey())
                .compact();
    }

        // "claims" are pieces of information stored in the JWT's payload (body). they r key-value pairs
        // Subject is a vlaim in the payload that typically holds the username / userid / email
        public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes())) //This checks the signature fr tampering
                .build()
                .parseClaimsJws(token) // This unhashes the claims in the body
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
            String email = extractUsername(token);

            // If the unhashed username is present in our database and the ep date isnt overdue then the tokens valid
            if (!userRepository.findByEmail(email).isPresent()) return false;
            if (isTokenExpired(token)) return false; // although technically redundant, keeping for readability. stuff it IDE
            return true;
    } 

    public boolean isTokenExpired(String token){
        Date expiration = extractClaims(token).getExpiration();

        if(expiration.before(new Date(System.currentTimeMillis()))) return true;

        return false;
    }

    public Claims extractClaims(String token){
        
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    public SecretKey getSignInKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String getExpirationTime(){
        return String.valueOf(EXP_TIME);
    }
}
