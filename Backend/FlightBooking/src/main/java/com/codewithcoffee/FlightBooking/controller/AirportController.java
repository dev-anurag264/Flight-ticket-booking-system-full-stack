package com.codewithcoffee.FlightBooking.controller;

import com.codewithcoffee.FlightBooking.dto.airportdto.AirportRequest;
import com.codewithcoffee.FlightBooking.dto.airportdto.AirportResponse;
import com.codewithcoffee.FlightBooking.service.AirportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth") //change to "api/airports"
@RequiredArgsConstructor
public class AirportController {
    private final AirportService airportService;

    @GetMapping
    public ResponseEntity<List<AirportResponse>> getAll() {
        return ResponseEntity.ok(airportService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AirportResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(airportService.getById(id));
    }

    @PostMapping("/new-airport")
    public ResponseEntity<AirportResponse> create(@Valid @RequestBody AirportRequest request) {
        return ResponseEntity.status
                        (HttpStatus.CREATED)
                .body(airportService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AirportResponse> update(@PathVariable Long id, @Valid @RequestBody AirportRequest request) {
        return ResponseEntity.ok(airportService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        airportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
