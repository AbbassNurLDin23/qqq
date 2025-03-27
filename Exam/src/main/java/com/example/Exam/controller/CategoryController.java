package com.example.Exam.controller;

import com.example.Exam.entity.Category;
import com.example.Exam.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // Create or Update a Category
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Category saveCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    // Get a Category by Title (ID)
    @GetMapping("/{title}")
    public Optional<Category> getCategoryByTitle(@PathVariable String title) {
        return categoryRepository.findById(title);
    }

    // Get All Categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Delete a Category by Title (ID)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{title}")
    public void deleteCategory(@PathVariable String title) {
        categoryRepository.deleteById(title);
    }
}
