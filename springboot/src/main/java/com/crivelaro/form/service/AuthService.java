package com.crivelaro.form.service;

import com.crivelaro.form.config.TokenService;
import com.crivelaro.form.dto.*;
import com.crivelaro.form.model.User;
import com.crivelaro.form.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.w3c.dom.ls.LSOutput;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    private final TokenService tokenService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthService(TokenService tokenService, BCryptPasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO, HttpServletResponse response) throws BadRequestException {
        Optional<User> user = this.userRepository.findByEmail(registerRequestDTO.email());

        if (user.isEmpty()) {

            User newUser = new User();
            newUser.setEmail(registerRequestDTO.email().toLowerCase());
            newUser.setPassword(passwordEncoder.encode(registerRequestDTO.password()));

            userRepository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            addJwtToCookies(token, response);
            return new AuthResponseDTO(newUser.getEmail(), token);
        }
        throw new BadRequestException("Erro ao criar usuário");
    }

    public AuthResponseDTO login(AuthRequestDTO authRequestDTO, HttpServletResponse response) {
        try {
            User user = this.userRepository.findByEmail(authRequestDTO.email().toLowerCase())
                    .orElseThrow(() -> new BadCredentialsException("Credenciais incorretas."));

            if (passwordEncoder.matches(authRequestDTO.password(), user.getPassword())) {
                String token = this.tokenService.generateToken(user);
                addJwtToCookies(token, response);
                return new AuthResponseDTO(user.getEmail(), token);
            }
            throw new BadCredentialsException("Credenciais incorretas.");
        } catch (RuntimeException e) {
            throw new RuntimeException("Erro ao autenticar usuário" + e.getMessage());
        }
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        tokenService.getJwtFromRequest(request);
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public AuthResponseDTO isAuthenticated(HttpServletRequest request) {
        String token = tokenService.getJwtFromRequest(request);
        String subject = tokenService.validateToken(token);
        if (subject != null) {
            User user = userRepository.findByEmail(subject).orElse(null);
            if(user != null) {
                return new AuthResponseDTO(user.getEmail(), token);
            }
        }
        return null;
    }

    private void addJwtToCookies(String token, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
