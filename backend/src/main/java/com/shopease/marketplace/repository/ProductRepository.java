package com.shopease.marketplace.repository;

import com.shopease.marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByBrand(String brand);
}
