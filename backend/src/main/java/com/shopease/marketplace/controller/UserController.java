package com.shopease.marketplace.controller;

import com.shopease.marketplace.entity.User;
import com.shopease.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Create a safe copy of the user data to return (exclude password)
            User safeUser = new User();
            safeUser.setId(user.getId());
            safeUser.setUsername(user.getUsername());
            safeUser.setEmail(user.getEmail());
            safeUser.setAddress(user.getAddress());
            safeUser.setPhoneNumber(user.getPhoneNumber());
            safeUser.setCountry(user.getCountry());
            safeUser.setRole(user.getRole());
            safeUser.setWishlistProductIds(user.getWishlistProductIds());
            safeUser.setCountry(user.getCountry());
            safeUser.setRole(user.getRole());
            safeUser.setWishlistProductIds(user.getWishlistProductIds());
            return ResponseEntity.ok(safeUser);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody User updateData) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Only update fields that are allowed
            if (updateData.getEmail() != null) user.setEmail(updateData.getEmail());
            if (updateData.getAddress() != null) user.setAddress(updateData.getAddress());
            if (updateData.getPhoneNumber() != null) user.setPhoneNumber(updateData.getPhoneNumber());
            if (updateData.getCountry() != null) user.setCountry(updateData.getCountry());
            
            if (updateData.getWishlistProductIds() != null) user.setWishlistProductIds(updateData.getWishlistProductIds());
            
            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}
