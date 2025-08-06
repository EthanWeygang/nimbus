package com.filestorage.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Use patterns instead of origins
        configuration.addAllowedMethod("*"); // Allows all methods
        configuration.setAllowedHeaders(List.of("*")); // Allows all headers
        configuration.setAllowCredentials(false); // Disable credentials for wildcard origins
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Use this configuration for all endpoints
        return source;
    }
}
