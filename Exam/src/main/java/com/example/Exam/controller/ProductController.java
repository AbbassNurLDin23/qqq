package com.example.Exam.controller;

import com.example.Exam.entity.Product;
import com.example.Exam.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Create or Update a Product
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Product saveProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // Get a Product by Title (ID)
    @GetMapping("/{title}")
    public Optional<Product> getProductByTitle(@PathVariable String title) {
        return productRepository.findById(title);
    }

    // Get All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Delete a Product by Title
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{title}")
    public void deleteProduct(@PathVariable String title) {
        productRepository.deleteById(title);
    }
}
