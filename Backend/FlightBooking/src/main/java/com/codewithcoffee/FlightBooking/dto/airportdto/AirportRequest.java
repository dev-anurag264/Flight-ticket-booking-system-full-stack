package com.codewithcoffee.FlightBooking.dto.airportdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AirportRequest {

    @NotBlank
    @Size(min = 3, max = 3, message = "IATA code must be exactly 3 letters")
    private String iataCode;

    @NotBlank
    @Size(max = 150)
    private String name;

    @NotBlank
    @Size(max = 100)
    private String city;

    @NotBlank
    @Size(max = 100)
    private String country;
}
