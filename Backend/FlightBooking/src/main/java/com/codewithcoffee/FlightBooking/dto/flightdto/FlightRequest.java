package com.codewithcoffee.FlightBooking.dto.flightdto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FlightRequest {
    @NotBlank
    @Size(max = 10)
    private String flightNumber;

    @NotNull(message = "Origin airport is required")
    private Long originAirportId;

    @NotNull(message = "Destination airport is required")
    private Long destinationAirportId;

    @NotNull
    @Future(message = "Departure time must be in the future")
    private LocalDateTime departureTime;

    @NotNull
    @Future(message = "Arrival time must be in the future")
    private LocalDateTime arrivalTime;

    private String aircraftType;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false, message = "Base fare must be positive")
    private BigDecimal baseFare;

    @AssertTrue(message = "Origin and destination airports must be different")
    private boolean isRouteValid() {
        return originAirportId == null || !originAirportId.equals(destinationAirportId);
    }
}
