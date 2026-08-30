package com.codewithcoffee.FlightBooking.mapper;

import com.codewithcoffee.FlightBooking.dto.airportdto.AirportRequest;
import com.codewithcoffee.FlightBooking.dto.airportdto.AirportResponse;
import com.codewithcoffee.FlightBooking.entity.Airport;
import org.springframework.stereotype.Component;

@Component
public class AirportMapper {

    public Airport toEntity(AirportRequest request){
        return Airport.builder()
                .iataCode(request.getIataCode().toUpperCase())
                .name(request.getName())
                .country(request.getCountry())
                .city(request.getCity())
                .build();
    }

    public AirportResponse toResponse(Airport airport) {
        return AirportResponse.builder()
                .id(airport.getId())
                .iataCode(airport.getIataCode())
                .name(airport.getName())
                .city(airport.getCity())
                .country(airport.getCountry())
                .build();
    }
}
