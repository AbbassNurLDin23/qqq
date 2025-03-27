package com.example.Exam.controller;

import com.example.Exam.entity.Product;
import com.example.Exam.entity.User;
import com.example.Exam.entity.UserCart;
import com.example.Exam.repositories.UserCartRepository;
import com.example.Exam.repositories.UserRepository;
import com.example.Exam.security.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/carts")
public class UserCartController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCartRepository userCartRepository;

    @Autowired
    private AuthContext authContext;

    @PostMapping("/addProduct")
    public UserCart addProductToCart(@RequestBody Product product) {
        Long userId = authContext.getCurrentUserId();

        // Check if user exists
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            // If user does not exist, return null or handle as needed
            return null;  // Optionally, you could throw an exception here or return an empty UserCart
        }

        // If user exists, proceed with fetching or creating user cart
        Optional<UserCart> userCartOptional = userCartRepository.findByUser(user.get());
        UserCart userCart = userCartOptional.orElseGet(() -> new UserCart(user.get()));

        // Add product to the cart
        return userCartRepository.addProductToCart(userCart, product);
    }


    @GetMapping()
    public Optional<UserCart> getUserCart(){
        Long userId = authContext.getCurrentUserId();
        User user = new User(userId);
        return userCartRepository.findByUser(user);
    }
}
