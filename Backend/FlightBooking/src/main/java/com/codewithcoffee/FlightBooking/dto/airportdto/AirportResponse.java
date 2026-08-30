package com.codewithcoffee.FlightBooking.dto.airportdto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AirportResponse {
    private Long id;
    private String iataCode;
    private String name;
    private String city;
    private String country;

}
