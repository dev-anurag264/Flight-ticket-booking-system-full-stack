package com.codewithcoffee.FlightBooking.mapper;

import com.codewithcoffee.FlightBooking.dto.flightdto.FlightRequest;
import com.codewithcoffee.FlightBooking.dto.flightdto.FlightResponse;
import com.codewithcoffee.FlightBooking.entity.Airport;
import com.codewithcoffee.FlightBooking.entity.Flight;
import com.codewithcoffee.FlightBooking.entity.FlightStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FlightMapper {
    private final AirportMapper airportMapper;

    public Flight toEntity(FlightRequest request, Airport origin, Airport destination) {
        return Flight.builder()
                .flightNumber(request.getFlightNumber().toUpperCase())
                .originAirport(origin)
                .destinationAirport(destination)
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .aircraftType(request.getAircraftType())
                .status(FlightStatus.SCHEDULED)
                .baseFare(request.getBaseFare())
                .build();
    }

    public FlightResponse toResponse(Flight flight) {
        return FlightResponse.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .origin(airportMapper.toResponse(flight.getOriginAirport()))
                .destination(airportMapper.toResponse(flight.getDestinationAirport()))
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .aircraftType(flight.getAircraftType())
                .status(flight.getStatus().name())
                .baseFare(flight.getBaseFare())
                .build();
    }
}
