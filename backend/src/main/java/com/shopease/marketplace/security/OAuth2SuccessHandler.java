package com.shopease.marketplace.security;

import com.shopease.marketplace.entity.User;
import com.shopease.marketplace.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${shopease.frontend.url}")
    private String frontendUrl;

    @Autowired
    public OAuth2SuccessHandler(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Create or fetch the user from our database
        Optional<User> existingUser = userRepository.findByUsername(email);
        User user;
        if (existingUser.isEmpty()) {
            user = new User();
            user.setUsername(email);
            user.setEmail(email);
            user.setPassword(""); // No password for OAuth2 users
            user.setRole("USER");
            user.setCountry("");
            user.setAddress("");
            user.setPhoneNumber("");
            userRepository.save(user);
        } else {
            user = existingUser.get();
        }

        // Generate a JWT for this user
        String token = jwtTokenProvider.createToken(user.getUsername());
        
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        // Redirect to frontend with only username
        String redirectUrl = frontendUrl + "/oauth2/callback?username=" + email;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
