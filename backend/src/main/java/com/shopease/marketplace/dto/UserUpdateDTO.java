package com.shopease.marketplace.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class UserUpdateDTO {
    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 255)
    private String address;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 100)
    private String country;

    private Set<Long> wishlistProductIds;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Set<Long> getWishlistProductIds() { return wishlistProductIds; }
    public void setWishlistProductIds(Set<Long> wishlistProductIds) { this.wishlistProductIds = wishlistProductIds; }
}
