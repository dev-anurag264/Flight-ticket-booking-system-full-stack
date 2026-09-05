package com.codewithcoffee.FlightBooking.controller;

import com.codewithcoffee.FlightBooking.dto.flightdto.FlightRequest;
import com.codewithcoffee.FlightBooking.dto.flightdto.FlightResponse;
import com.codewithcoffee.FlightBooking.dto.flightdto.FlightSearchRequest;
import com.codewithcoffee.FlightBooking.dto.flightdto.FlightStatusUpdateRequest;
import com.codewithcoffee.FlightBooking.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@Slf4j
public class FlightController {
    private final FlightService flightService;


    @GetMapping
    public ResponseEntity<List<FlightResponse>> getAll(){
        return ResponseEntity.ok(flightService.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightResponse>> search(@Valid FlightSearchRequest searchRequest){
        return ResponseEntity.ok(flightService.search(searchRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(flightService.getById(id));
    }

    @PostMapping("/new")
    public ResponseEntity<FlightResponse> create(@Valid @RequestBody FlightRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flightService.create(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FlightResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody FlightStatusUpdateRequest request) {
        return ResponseEntity.ok(flightService.updateStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flightService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
