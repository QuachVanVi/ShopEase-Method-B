package com.shopease.marketplace.controller;

import com.shopease.marketplace.entity.Review;
import com.shopease.marketplace.entity.Product;
import com.shopease.marketplace.entity.User;
import com.shopease.marketplace.repository.ReviewRepository;
import com.shopease.marketplace.repository.ProductRepository;
import com.shopease.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestParam Long productId, @RequestParam String username, @RequestBody Review review) {
        Product product = productRepository.findById(productId).orElse(null);
        User user = userRepository.findByUsername(username).orElse(null);

        if (product == null || user == null) {
            return ResponseEntity.badRequest().body("Invalid product or user");
        }

        review.setProduct(product);
        review.setUser(user);
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }
}
