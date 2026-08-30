package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.dto.flightdto.FlightRequest;
import com.codewithcoffee.FlightBooking.dto.flightdto.FlightResponse;
import com.codewithcoffee.FlightBooking.dto.flightdto.FlightSearchRequest;
import com.codewithcoffee.FlightBooking.entity.Airport;
import com.codewithcoffee.FlightBooking.entity.Flight;
import com.codewithcoffee.FlightBooking.entity.FlightStatus;
import com.codewithcoffee.FlightBooking.mapper.FlightMapper;
import com.codewithcoffee.FlightBooking.repository.AirportRepository;
import com.codewithcoffee.FlightBooking.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final FlightMapper flightMapper;

    public FlightResponse create(FlightRequest request) {
        String flightNumber = request.getFlightNumber().toUpperCase();
        if (flightRepository.existsByFlightNumber(flightNumber)) {
            throw new RuntimeException(HttpStatus.CONFLICT + "Flight number already exists");
        }

        Airport origin = findAirportOrThrow(request.getOriginAirportId());
        Airport destination = findAirportOrThrow(request.getDestinationAirportId());

        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new RuntimeException(HttpStatus.BAD_REQUEST + "Arrival time must be after departure time");
        }

        Flight flight = flightMapper.toEntity(request, origin, destination);
        Flight saved = flightRepository.save(flight);
        return flightMapper.toResponse(saved);
    }

    public List<FlightResponse> getAll() {
        return flightRepository.findAll().stream()
                .map(flightMapper::toResponse)
                .toList();
    }

    public FlightResponse getById(Long id) {
        return flightMapper.toResponse(findFlightOrThrow(id));
    }

    public FlightResponse updateStatus(Long id, FlightStatus newStatus) {
        Flight flight = findFlightOrThrow(id);
        flight.setStatus(newStatus);
        return flightMapper.toResponse(flight);
    }

    public void delete(Long id) {
        Flight flight = findFlightOrThrow(id);
        flightRepository.delete(flight);
    }

    public List<FlightResponse> search(FlightSearchRequest request) {
        LocalDateTime startOfDay = request.getDate().atStartOfDay();
        LocalDateTime endOfDay = request.getDate().atTime(23, 59, 59);

        List<Flight> flights = flightRepository.searchFlights(
                request.getOrigin().toUpperCase(),
                request.getDestination().toUpperCase(),
                startOfDay,
                endOfDay,
                FlightStatus.CANCELLED
        );

        return flights.stream().map(flightMapper::toResponse).toList();
    }

    private Airport findAirportOrThrow(Long id) {
        return airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(HttpStatus.NOT_FOUND + "Airport not found"));
    }

    private Flight findFlightOrThrow(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(HttpStatus.NOT_FOUND + "Flight not found"));
    }

}
