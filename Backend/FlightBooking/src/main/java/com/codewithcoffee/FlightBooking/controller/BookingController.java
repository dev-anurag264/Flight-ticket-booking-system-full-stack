package com.codewithcoffee.FlightBooking.controller;

import com.codewithcoffee.FlightBooking.dto.bookings.BookingRequest;
import com.codewithcoffee.FlightBooking.dto.bookings.BookingResponse;
import com.codewithcoffee.FlightBooking.entity.User;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.repository.UserRepository;
import com.codewithcoffee.FlightBooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<BookingResponse> create(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        Long customerId = resolveCustomerId(authentication);
        BookingResponse response = bookingService.createBooking(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        Long customerId = resolveCustomerId(authentication);
        return ResponseEntity.ok(bookingService.getBookingsForCustomer(customerId));
    }

    @GetMapping("/{pnr}")
    public ResponseEntity<BookingResponse> getByPnr(@PathVariable String pnr) {
        return ResponseEntity.ok(bookingService.getByPnr(pnr));
    }

    private Long resolveCustomerId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException( "User not found",HttpStatus.NOT_FOUND));
        return user.getId();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id, Authentication authentication) {
        Long customerId = resolveCustomerId(authentication);
        return ResponseEntity.ok(bookingService.cancelBooking(customerId, id));
    }

}
