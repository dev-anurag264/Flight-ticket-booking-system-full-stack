package com.codewithcoffee.FlightBooking.controller;


import com.codewithcoffee.FlightBooking.dto.paymentdto.PaymentRequest;
import com.codewithcoffee.FlightBooking.dto.paymentdto.PaymentResponse;
import com.codewithcoffee.FlightBooking.entity.User;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.repository.UserRepository;
import com.codewithcoffee.FlightBooking.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<PaymentResponse> pay(@Valid @RequestBody PaymentRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException( "User not found", HttpStatus.UNAUTHORIZED));
        PaymentResponse response = paymentService.processPayment(user.getId(), request);
        return ResponseEntity.ok(response);
    }
}