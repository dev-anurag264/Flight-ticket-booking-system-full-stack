package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.dto.LoginRequest;
import com.codewithcoffee.FlightBooking.dto.LoginResponse;
import com.codewithcoffee.FlightBooking.dto.RegisterRequest;
import com.codewithcoffee.FlightBooking.dto.RegisterResponse;
import com.codewithcoffee.FlightBooking.entity.Role;
import com.codewithcoffee.FlightBooking.entity.User;
import com.codewithcoffee.FlightBooking.repository.UserRepository;
import com.codewithcoffee.FlightBooking.util.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new RegisterResponse(token, user.getEmail(), user.getRole().name());
    }

    public LoginResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        User user=userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, user.getEmail(), user.getRole().name());
    }
}
