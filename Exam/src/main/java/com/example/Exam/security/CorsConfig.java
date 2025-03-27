package com.example.Exam.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")  // Allow frontend at localhost:3000
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allow required methods
                        .allowedHeaders("*")  // Allow all headers
                        .allowCredentials(true)  // Allow credentials like cookies or authorization headers
                        .maxAge(3600);  // Cache CORS preflight response for 1 hour
            }
        };
    }
}
