package com.crivelaro.form.controller;

import com.crivelaro.form.dto.*;
import com.crivelaro.form.model.User;
import com.crivelaro.form.repository.UserRepository;
import com.crivelaro.form.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.BadRequestException;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/validate")
    public AuthResponseDTO validate(HttpServletRequest request) {
        return authService.isAuthenticated(request);
    }

    @PostMapping("/register")
    public AuthResponseDTO create(@RequestBody RegisterRequestDTO registerRequestDTO, HttpServletResponse response) throws BadRequestException {
        return authService.register(registerRequestDTO, response);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody AuthRequestDTO authRequestDTO, HttpServletResponse response) {
        return authService.login(authRequestDTO, response);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok().build();
    }
}
