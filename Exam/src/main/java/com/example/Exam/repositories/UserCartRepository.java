package com.example.Exam.repositories;

import com.example.Exam.entity.Product;
import com.example.Exam.entity.User;
import com.example.Exam.entity.UserCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCartRepository extends JpaRepository<UserCart, Long> {

    Optional<UserCart> findByUser(User user);

    default UserCart addProductToCart(UserCart userCart, Product product) {
        userCart.getProducts().add(product);
        return save(userCart);
    }
}
