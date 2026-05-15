package com.shopease.marketplace.controller;

import com.shopease.marketplace.entity.Review;
import com.shopease.marketplace.dto.ReviewDTO;
import com.shopease.marketplace.entity.Product;
import com.shopease.marketplace.entity.User;
import com.shopease.marketplace.repository.ReviewRepository;
import com.shopease.marketplace.repository.ProductRepository;
import com.shopease.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReviewController(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<Object> addReview(@Valid @RequestBody ReviewDTO reviewDTO, Authentication authentication) {
        if (!authentication.getName().equals(reviewDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only post reviews as yourself");
        }
        Product product = productRepository.findById(reviewDTO.getProductId()).orElse(null);
        User user = userRepository.findByUsername(reviewDTO.getUsername()).orElse(null);

        if (product == null || user == null) {
            return ResponseEntity.badRequest().body("Invalid product or user");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());
        
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }
}
