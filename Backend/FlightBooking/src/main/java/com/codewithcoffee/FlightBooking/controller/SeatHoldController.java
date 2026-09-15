package com.codewithcoffee.FlightBooking.controller;

import com.codewithcoffee.FlightBooking.dto.SeatHoldRequest;
import com.codewithcoffee.FlightBooking.dto.SeatResponse;
import com.codewithcoffee.FlightBooking.service.SeatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatHoldController {
    private final SeatService  seatService;

    @PostMapping("/hold")
    public ResponseEntity<SeatResponse> hold(@Valid @RequestBody SeatHoldRequest request){
        return ResponseEntity.ok(seatService.holdSeat(request.getSeatId()));
    }
}
