package com.codewithcoffee.FlightBooking.dto.flightdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FlightSearchRequest {
    @NotBlank
    private String origin;

    @NotBlank
    private String destination;

    @NotNull
    private LocalDate date;
}
