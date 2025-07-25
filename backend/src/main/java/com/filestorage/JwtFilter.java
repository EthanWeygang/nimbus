package com.filestorage;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter implements Filter {

    private final JwtService jwtService;
    
    // URLs that don't need authentication
    private final List<String> publicUrls = Arrays.asList(
        "/api/login",
        "/api/signup"
    );

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String requestURI = httpRequest.getRequestURI();
        
        // Allow public URLs without authentication
        if (isPublicUrl(requestURI)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Extract JWT token from Authorization header
        String token = extractTokenFromRequest(httpRequest);
        
        if (token == null || !jwtService.isTokenValid(token)) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"error\":\"Unauthorized - Invalid or missing token\"}");
            httpResponse.setContentType("application/json");
            return;
        }
        
        // Token is valid, continue with request
        chain.doFilter(request, response);
    }
    
    private boolean isPublicUrl(String requestURI) {
        return publicUrls.stream().anyMatch(requestURI::startsWith);
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}
