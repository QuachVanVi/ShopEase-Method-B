# JWT Security Documentation - ShopEase Marketplace

This document outlines the JWT (JSON Web Token) implementation used for securing the ShopEase backend.

## Architecture Overview
The security system follows a **stateless** architecture using Spring Security and the JJWT library.

### Key Components
1.  **JwtTokenProvider**: The core engine for JWT operations.
    *   **Algorithm**: HS256 (HMAC with SHA-256).
    *   **Secret Key**: Managed via `shopease.jwt.secret` in `application.properties`.
    *   **Expiration**: Configurable (default: 60 minutes).
2.  **JwtAuthenticationFilter**: A security filter that intercepts every request.
    *   Extracts the token from the `Authorization: Bearer <token>` header.
    *   Validates the token signature and expiration.
    *   Populates the Spring `SecurityContext` with user details if valid.
3.  **CustomUserDetailsService**: Bridges Spring Security with our database to load user information during token validation.

## Security Policy

### Endpoints
*   **Public Access**: 
    *   `/api/auth/**` (Login and Registration)
    *   `/api/products/**` (Catalog browsing)
    *   `/v3/api-docs/**`, `/swagger-ui/**` (API Documentation)
*   **Authenticated Access**:
    *   `/api/users/**` (Profile and user management)
    *   All other API endpoints.

### CSRF Protection
CSRF (Cross-Site Request Forgery) protection is **disabled** by design. 
**Rationale**: Our API is stateless and does not use cookies for authentication. Since the JWT must be manually added to the `Authorization` header by the client, cross-site requests (which browsers do not automatically add custom headers to) are unable to perform authenticated actions on behalf of the user.

## How to use
To access protected endpoints, include the following header in your HTTP requests:
```http
Authorization: Bearer <your_jwt_token>
```

## Maintenance
To change the secret key or token expiration, update the following properties in `src/main/resources/application.properties`:
```properties
shopease.jwt.secret=your-very-long-and-secure-secret-key
shopease.jwt.expirationMs=3600000
```
