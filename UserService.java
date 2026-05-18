package com.autotrack.service;

import com.autotrack.dto.*;
import com.autotrack.model.User;
import com.autotrack.repository.UserRepository;
import com.autotrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.regex.*;

@Service
public class UserService {
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        validatePassword(req.getPassword());
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());
        user.setRole("USER");
        User saved = userRepo.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole(), saved.getId());
        return new AuthResponse(token, saved.getId(), saved.getRole(), saved.getName(), saved.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getRole(), user.getName(), user.getEmail());
    }

    private void validatePassword(String pwd) {
        if (pwd.length() < 8) throw new RuntimeException("Password must be at least 8 characters");
        if (!Pattern.compile("[A-Z]").matcher(pwd).find())
            throw new RuntimeException("Password must contain at least one uppercase letter");
        if (!Pattern.compile("[^a-zA-Z0-9]").matcher(pwd).find())
            throw new RuntimeException("Password must contain at least one special character");
    }
}
