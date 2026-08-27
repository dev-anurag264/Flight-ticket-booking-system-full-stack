package com.codewithcoffee.FlightBooking.controller;

import com.codewithcoffee.FlightBooking.dto.LoginRequest;
import com.codewithcoffee.FlightBooking.dto.LoginResponse;
import com.codewithcoffee.FlightBooking.dto.RegisterRequest;
import com.codewithcoffee.FlightBooking.dto.RegisterResponse;
import com.codewithcoffee.FlightBooking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService  authService;


    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
