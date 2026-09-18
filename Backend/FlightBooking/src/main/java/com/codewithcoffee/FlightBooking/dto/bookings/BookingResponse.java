package com.codewithcoffee.FlightBooking.dto.bookings;

import com.codewithcoffee.FlightBooking.dto.flightdto.FlightResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String pnr;
    private FlightResponse flight;
    private String status;
    private List<PassengerResponse> passengers;
    private LocalDateTime createdAt;
}
