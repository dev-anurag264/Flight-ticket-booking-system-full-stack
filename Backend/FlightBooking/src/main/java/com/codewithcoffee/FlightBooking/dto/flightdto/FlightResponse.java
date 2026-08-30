package com.codewithcoffee.FlightBooking.dto.flightdto;

import com.codewithcoffee.FlightBooking.dto.airportdto.AirportResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class FlightResponse {
    private Long id;
    private String flightNumber;
    private AirportResponse origin;
    private AirportResponse destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String aircraftType;
    private String status;
    private BigDecimal baseFare;
}
