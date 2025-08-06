package com.filestorage.config;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.filestorage.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// This 'component' tells spring to send every request through here first before its target endpoint
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{ 

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
        JwtService jwtService,
        UserDetailsService userDetailsService,
        HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException,IOException {
        final String requestURI = request.getRequestURI();
        final String method = request.getMethod();
        logger.info("JWT Filter processing: {} {}", method, requestURI);
        
        // Skip JWT processing for public endpoints
        if (requestURI.equals("/api/login") || 
            requestURI.equals("/api/signup") || 
            requestURI.equals("/api/verify") ||
            requestURI.equals("/api/resend-verification")) {
            logger.info("Skipping JWT filter for public endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        logger.info("Auth header present: {}", authHeader != null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            logger.info("No valid auth header, allowing request to proceed");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);
            logger.info("Extracted email from token: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.info("Loading user details for: {}", userEmail);
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                
                if (jwtService.isTokenValid(jwt)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Authentication successful for: {}", userEmail);
                }
            }
            
            filterChain.doFilter(request, response);
            
        } catch (Exception exception) {
            logger.error("JWT Filter error: {}", exception.getMessage());
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}
