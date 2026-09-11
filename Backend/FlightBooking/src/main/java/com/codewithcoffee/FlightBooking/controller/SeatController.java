package com.codewithcoffee.FlightBooking.controller;

import com.codewithcoffee.FlightBooking.dto.SeatGenerationRequest;
import com.codewithcoffee.FlightBooking.dto.SeatResponse;
import com.codewithcoffee.FlightBooking.service.SeatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights/{flightId}/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;

    @PostMapping("/generate")
    public ResponseEntity<List<SeatResponse>> generate(
            @PathVariable Long flightId,
            @Valid @RequestBody SeatGenerationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seatService.generateSeats(flightId, request));
    }

    @GetMapping
    public ResponseEntity<List<SeatResponse>> getSeats(@PathVariable Long flightId) {
        return ResponseEntity.ok(seatService.getSeatsForFlight(flightId));
    }
}
